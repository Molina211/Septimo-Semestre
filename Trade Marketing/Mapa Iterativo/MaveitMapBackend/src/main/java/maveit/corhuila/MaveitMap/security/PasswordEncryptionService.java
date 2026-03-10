package maveit.corhuila.MaveitMap.security;

import jakarta.annotation.PostConstruct;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH_BIT = 128;

    private final SecurityCryptoProperties cryptoProperties;
    private SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordEncryptionService(SecurityCryptoProperties cryptoProperties) {
        this.cryptoProperties = cryptoProperties;
    }

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(cryptoProperties.getKey());
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    public String encrypt(char[] password) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);
            byte[] plaintext = new String(password).getBytes(StandardCharsets.UTF_8);
            byte[] cipherText = cipher.doFinal(plaintext);
            ByteBuffer buffer = ByteBuffer.allocate(iv.length + cipherText.length);
            buffer.put(iv);
            buffer.put(cipherText);
            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to encrypt password", ex);
        }
    }

    public boolean matches(char[] plain, String encrypted) {
        try {
            byte[] allBytes = Base64.getDecoder().decode(encrypted);
            ByteBuffer buffer = ByteBuffer.wrap(allBytes);
            byte[] iv = new byte[IV_LENGTH];
            buffer.get(iv);
            byte[] ciphertext = new byte[buffer.remaining()];
            buffer.get(ciphertext);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(TAG_LENGTH_BIT, iv));
            byte[] decrypted = cipher.doFinal(ciphertext);
            String plainText = new String(decrypted, StandardCharsets.UTF_8);
            return plainText.equals(new String(plain));
        } catch (Exception ex) {
            return false;
        }
    }
}
