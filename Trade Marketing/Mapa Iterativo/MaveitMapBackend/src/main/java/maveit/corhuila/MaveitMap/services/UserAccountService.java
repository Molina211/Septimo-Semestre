package maveit.corhuila.MaveitMap.services;

import java.util.List;
import maveit.corhuila.MaveitMap.dto.RegisterUserRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetSessionResponse;
import maveit.corhuila.MaveitMap.dto.PasswordResetUpdateRequest;
import maveit.corhuila.MaveitMap.dto.PasswordResetVerifyRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationConfirmationRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationResendRequest;
import maveit.corhuila.MaveitMap.dto.RegistrationSessionResponse;
import maveit.corhuila.MaveitMap.dto.UpdateUserRequest;
import maveit.corhuila.MaveitMap.dto.UserAccountResponse;
import maveit.corhuila.MaveitMap.models.UserAccount;
import maveit.corhuila.MaveitMap.models.UserRole;

public interface UserAccountService {
    RegistrationSessionResponse register(RegisterUserRequest request, UserRole actingRole, Long actingUserId,
            String initialSuperAdminSecret);
    List<UserAccountResponse> listUsers(UserRole requestingRole, Long requestingUserId);
    UserAccountResponse getUser(Long id, UserRole requestingRole, Long requestingUserId);
    UserAccountResponse updateUser(Long id, UpdateUserRequest request, UserRole requestingRole, Long requestingUserId);
    UserAccountResponse updateUserStatus(Long id, boolean enabled, UserRole requestingRole, Long requestingUserId);
    void deleteUser(Long id, UserRole requestingRole);
    void resendWelcomeEmail(String email, UserRole requestingRole, Long requestingUserId);
    UserAccount confirmRegistration(RegistrationConfirmationRequest request);
    void resendVerificationCode(RegistrationResendRequest request);
    PasswordResetSessionResponse requestPasswordReset(PasswordResetRequest request);
    PasswordResetSessionResponse verifyPasswordReset(PasswordResetVerifyRequest request);
    void resetPassword(PasswordResetUpdateRequest request);
    void markSessionActive(Long id, boolean active);
    void releaseAccounts(List<Long> userIds, UserRole requestingRole, Long requestingUserId);
    void releaseSelf(Long userId);

    // Auth helpers
    void revokeRefreshToken(String refreshToken);
}
