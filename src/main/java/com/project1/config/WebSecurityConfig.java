package com.project1.config;

import com.project1.controller.ErrorHandlerController;
import com.project1.service_impl.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    @Autowired
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // disable crsf
        http.csrf().disable();

        http.headers().defaultsDisabled().disable();

        // cho phép tất cả các request truy cập
        http.authorizeRequests().antMatchers("/", "/trang-chu", "/dang-nhap", "/dang-xuat", "/error").permitAll();

        // chỉ cho phép người dùng đã đăng nhập với quền user hoặc admin truy cập
        http.authorizeRequests().antMatchers("/user/**", "/cong-viec-ca-nhan", "/danh-gia")
                .access("hasAnyRole('ROLE_USER')");

        // chỉ cho phép người dùng đã đăng nhập với admin truy cập chỉ cho
        http.authorizeRequests().antMatchers("/admin/**", "/du-an/**", "/nhan-vien/**", "/thong-ke")
                .access("hasRole('ROLE_ADMIN')");

        http.authorizeRequests().antMatchers("/thong-tin-ca-nhan", "/employee/update", "/employee/insert"
                , "/employee/find-by-id/**", "/task-to-employee/search", "/task-to-employee/search-by-name"
                , "/task-to-employee/update").access("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')");

        // khi người dùng login với vai trò X, nhưng truy cập vào trang yêu cầu vai trò Y
        // ngoại lệ AccessDeniedException sẽ ném ra
        // đã được error controller bắt lỗi
        http.authorizeRequests().and().exceptionHandling().accessDeniedPage("/error");

        // cấu hình cho login
        http.authorizeRequests().and()
                .logout().logoutUrl("/dang-xuat").clearAuthentication(true).deleteCookies().invalidateHttpSession(true)
                .logoutSuccessUrl("/")
                .and().formLogin().loginPage("/dang-nhap")
                .loginProcessingUrl("/security-login").defaultSuccessUrl("/api/v1/public/login-process/success")
                .failureUrl("/api/v1/public/login-process/fail")
                .usernameParameter("username").passwordParameter("password");
    }
}
