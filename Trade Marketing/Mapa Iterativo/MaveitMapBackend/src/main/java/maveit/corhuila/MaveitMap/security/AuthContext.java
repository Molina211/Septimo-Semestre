package maveit.corhuila.MaveitMap.security;

public final class AuthContext {

    private static final ThreadLocal<AuthDetails> CURRENT = new ThreadLocal<>();

    public static void set(AuthDetails details) {
        CURRENT.set(details);
    }

    public static AuthDetails get() {
        return CURRENT.get();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
