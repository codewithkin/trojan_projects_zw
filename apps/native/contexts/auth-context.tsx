import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@/components/auth-modal";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signOut: () => Promise<void>;
    refetchSession: () => Promise<void>;
    requireAuth: (message?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState<string | undefined>();
    const [authResolve, setAuthResolve] = useState<((value: boolean) => void) | null>(null);

    const fetchSession = useCallback(async () => {
        try {
            const { data: session } = await authClient.getSession();
            if (session?.user) {
                setUser(session.user as User);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const signOut = useCallback(async () => {
        try {
            await authClient.signOut();
            setUser(null);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }, []);

    const refetchSession = useCallback(async () => {
        await fetchSession();
    }, [fetchSession]);

    // Function to require auth - returns true if authenticated, shows modal if not
    const requireAuth = useCallback((message?: string): Promise<boolean> => {
        if (user) {
            return Promise.resolve(true);
        }
        
        return new Promise((resolve) => {
            setAuthMessage(message || "Please sign in to continue");
            setAuthResolve(() => resolve);
            setShowAuthModal(true);
        });
    }, [user]);

    const handleAuthModalClose = useCallback(() => {
        setShowAuthModal(false);
        authResolve?.(false);
        setAuthResolve(null);
        setAuthMessage(undefined);
    }, [authResolve]);

    const handleAuthSuccess = useCallback(async () => {
        await fetchSession();
        authResolve?.(true);
        setAuthResolve(null);
        setAuthMessage(undefined);
    }, [fetchSession, authResolve]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                signOut,
                refetchSession,
                requireAuth,
            }}
        >
            {children}
            <AuthModal
                visible={showAuthModal}
                onClose={handleAuthModalClose}
                onSuccess={handleAuthSuccess}
                message={authMessage}
            />
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
