package com.campusrunner.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campusrunner.entity.User;
import com.campusrunner.mapper.UserMapper;
import com.campusrunner.service.UserService;
import com.campusrunner.util.Md5Util;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(String username, String password) {
        User user = this.getByUsername(username);
        if (user != null && user.getPassword().equals(Md5Util.md5(password))) {
            return user;
        }
        return null;
    }

    @Override
    public boolean register(User user) {
        if (getByUsername(user.getUsername()) != null) {
            return false; // 用户名已存在
        }
        user.setPassword(Md5Util.md5(user.getPassword()));
        user.setRole(0);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        return this.save(user);
    }

    @Override
    public User getByUsername(String username) {
        return this.lambdaQuery().eq(User::getUsername, username).one();
    }
}






