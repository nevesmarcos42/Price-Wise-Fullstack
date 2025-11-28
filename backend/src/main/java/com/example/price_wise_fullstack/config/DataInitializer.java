package com.example.price_wise_fullstack.config;

import com.example.price_wise_fullstack.model.User;
import com.example.price_wise_fullstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Create default admin user if not exists
            if (!userRepository.existsByEmail("admin@pricewise.com")) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@pricewise.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                admin.setActive(true);
                
                userRepository.save(admin);
                log.info("✅ Default admin user created!");
                log.info("📧 Email: admin@pricewise.com");
                log.info("🔑 Password: admin123");
            }

            // Create default regular user if not exists
            if (!userRepository.existsByEmail("user@pricewise.com")) {
                User user = new User();
                user.setName("Test User");
                user.setEmail("user@pricewise.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole(User.Role.USER);
                user.setActive(true);
                
                userRepository.save(user);
                log.info("✅ Default test user created!");
                log.info("📧 Email: user@pricewise.com");
                log.info("🔑 Password: user123");
            }

            log.info("🚀 Application ready with test users!");
        };
    }
}
