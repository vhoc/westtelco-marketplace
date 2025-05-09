import { User } from '@supabase/supabase-js';
import { validateServerActionRole, AuthError, PermissionError, RoleConfigError } from '../serverActions'; // Adjust import path
import { createClient } from '@/utils/supabase/server'; // Import the function we need to mock
import { TRole } from "@/types";

// --- Mocking Setup ---

// Mock the entire module that exports createClient
jest.mock('@/utils/supabase/server', () => ({
    createClient: jest.fn(), // Mock the createClient function
}));

// Define mock error classes locally if they aren't exported/importable
// If they ARE exported from serverActions.ts, you don't need these definitions here.
// class AuthError extends Error { constructor(message = "Authentication required.") { super(message); this.name = "AuthError"; }}
// class PermissionError extends Error { constructor(message = "Permission denied.") { super(message); this.name = "PermissionError"; }}
// class RoleConfigError extends Error { constructor(message = "User role configuration issue.") { super(message); this.name = "RoleConfigError"; }}


// --- Test Suite ---

describe('validateServerActionRole', () => {
    // Define mock user data
    const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
    };

    // Define mock roles
    const adminRole: TRole = 'westtelco-admin';
    const agentRole: TRole = 'westtelco-agent';
    const limitedRole: TRole = 'westtelco-limited';

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user and role when user is authenticated and has an allowed role', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            // Mock the chained query
            from: jest.fn().mockReturnThis(), // Return `this` to allow chaining
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { role: adminRole }, error: null }),
        };
        // Configure our mock createClient to return the mock Supabase client
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        const allowedRoles: TRole[] = [adminRole, agentRole];
        const result = await validateServerActionRole(allowedRoles);

        expect(result).toEqual({ user: mockUser, role: adminRole });
        expect(createClient).toHaveBeenCalledTimes(1);
        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1);
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('user');
        expect(mockSupabaseClient.select).toHaveBeenCalledWith('role');
        expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUser.id);
        expect(mockSupabaseClient.single).toHaveBeenCalledTimes(1);
    });

    it('should throw AuthError if user is not authenticated', async () => {
        const mockSupabaseClient = {
            auth: {
                // Simulate no user found
                getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
            },
            // Other methods won't be called, but mock them just in case
            from: jest.fn(),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        const allowedRoles: TRole[] = [adminRole];

        // Expect the promise to reject with AuthError
        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(AuthError);
        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow("Authentication required.");

        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(2); // Called twice due to expect structure
        expect(mockSupabaseClient.from).not.toHaveBeenCalled(); // DB query should not happen
    });

     it('should throw AuthError if supabase.auth.getUser returns an error', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: new Error('Supabase auth error') }),
            },
            from: jest.fn(),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        const allowedRoles: TRole[] = [adminRole];

        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(AuthError);

        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1);
        expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });


    it('should throw RoleConfigError if fetching profile fails', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            // Simulate database error during profile fetch
            single: jest.fn().mockResolvedValue({ data: null, error: new Error('DB connection failed') }),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        const allowedRoles: TRole[] = [adminRole];

        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(RoleConfigError);
        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow('Could not verify user role.');

        expect(mockSupabaseClient.single).toHaveBeenCalledTimes(2);
    });

    it('should throw RoleConfigError if profile is found but role is null or missing', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            // Simulate profile found, but role column is null
            single: jest.fn().mockResolvedValue({ data: { role: null }, error: null }),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        const allowedRoles: TRole[] = [adminRole];

        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(RoleConfigError);
        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow('User role not assigned or profile missing.');

         expect(mockSupabaseClient.single).toHaveBeenCalledTimes(2);
    });

     it('should throw PermissionError if user role is not in the allowed list', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
             // Simulate user having the 'limited' role
            single: jest.fn().mockResolvedValue({ data: { role: limitedRole }, error: null }),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        // Define allowed roles that *don't* include 'limited'
        const allowedRoles: TRole[] = [adminRole, agentRole];

        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(PermissionError);
        await expect(validateServerActionRole(allowedRoles)).rejects.toThrow(`Role '${limitedRole}' is not authorized for this action.`);

        expect(mockSupabaseClient.single).toHaveBeenCalledTimes(2);
    });

     it('should allow access if user role matches one of the allowed roles', async () => {
        const mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
             // Simulate user having the 'agent' role
            single: jest.fn().mockResolvedValue({ data: { role: agentRole }, error: null }),
        };
        (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);

        // Allow both admin and agent
        const allowedRoles: TRole[] = [adminRole, agentRole];
        const result = await validateServerActionRole(allowedRoles);

        expect(result).toEqual({ user: mockUser, role: agentRole }); // Expect the actual role back
        expect(mockSupabaseClient.single).toHaveBeenCalledTimes(1);
    });

});