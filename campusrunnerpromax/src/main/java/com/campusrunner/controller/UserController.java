package com.campusrunner.controller;

import com.campusrunner.common.Result;
import com.campusrunner.entity.User;
import com.campusrunner.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 手机号校验正则表达式：11位，以1开头，第二位为3-9
    private static final String PHONE_PATTERN = "^1[3-9]\\d{9}$";
    // 邮箱校验正则表达式
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    @PostMapping("/register")
    public Result<String> register(@RequestBody User user) {
        // 校验必填字段
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return Result.error("用户名不能为空");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return Result.error("密码不能为空");
        }
        if (user.getPassword().length() < 6) {
            return Result.error("密码长度至少6位");
        }
        if (user.getNickname() == null || user.getNickname().trim().isEmpty()) {
            return Result.error("昵称不能为空");
        }
        
        // 校验邮箱
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            if (!user.getEmail().matches(EMAIL_PATTERN)) {
                return Result.error("邮箱格式不正确，请输入有效的邮箱地址");
            }
        }
        
        // 校验手机号
        if (user.getPhone() != null && !user.getPhone().trim().isEmpty()) {
            if (!user.getPhone().matches(PHONE_PATTERN)) {
                return Result.error("手机号格式不正确，请输入11位有效手机号（1开头的11位数字）");
            }
        }
        
        if (userService.register(user)) {
            return Result.success("注册成功");
        }
        return Result.error("用户名已存在");
    }

    @PostMapping("/login")
    public Result<User> login(@RequestParam String username, 
                              @RequestParam String password,
                              HttpSession session) {
        User user = userService.login(username, password);
        if (user != null) {
            user.setPassword(null); // 不返回密码
            session.setAttribute("user", user);
            return Result.success("登录成功", user);
        }
        return Result.error("用户名或密码错误");
    }

    @PostMapping("/logout")
    public Result<String> logout(HttpSession session) {
        session.invalidate();
        return Result.success("退出成功");
    }

    @GetMapping("/info")
    public Result<User> getInfo(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            // 从数据库重新获取最新信息
            User dbUser = userService.getById(user.getId());
            if (dbUser != null) {
                dbUser.setPassword(null);
                session.setAttribute("user", dbUser);
                return Result.success(dbUser);
            }
        }
        return Result.error("未登录");
    }

    @PutMapping("/update")
    public Result<String> update(@RequestBody User user, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return Result.error("请先登录");
        }
        User dbUser = userService.getById(currentUser.getId());
        if (dbUser == null) {
            return Result.error("用户不存在");
        }
        // 校验邮箱
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            if (!user.getEmail().matches(EMAIL_PATTERN)) {
                return Result.error("邮箱格式不正确，请输入有效的邮箱地址");
            }
        }
        // 校验手机号
        if (user.getPhone() != null && !user.getPhone().trim().isEmpty()) {
            if (!user.getPhone().matches(PHONE_PATTERN)) {
                return Result.error("手机号格式不正确，请输入11位有效手机号（1开头的11位数字）");
            }
        }
        // 更新允许修改的字段
        if (user.getNickname() != null) {
            dbUser.setNickname(user.getNickname());
        }
        if (user.getEmail() != null) {
            dbUser.setEmail(user.getEmail());
        }
        if (user.getPhone() != null) {
            dbUser.setPhone(user.getPhone());
        }
        if (user.getAvatar() != null) {
            dbUser.setAvatar(user.getAvatar());
        }
        dbUser.setUpdateTime(java.time.LocalDateTime.now());
        userService.updateById(dbUser);
        // 更新 session 中的用户信息
        dbUser.setPassword(null);
        session.setAttribute("user", dbUser);
        return Result.success("更新成功");
    }
}


