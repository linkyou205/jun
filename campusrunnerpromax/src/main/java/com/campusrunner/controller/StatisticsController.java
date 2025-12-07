package com.campusrunner.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campusrunner.common.Result;
import com.campusrunner.entity.Task;
import com.campusrunner.service.TaskService;
import com.campusrunner.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping("/overview")
    public Result<Map<String, Object>> overview() {
        Map<String, Object> data = new HashMap<>();
        
        // 总用户数
        long totalUsers = userService.count();
        data.put("totalUsers", totalUsers);
        
        // 总任务数
        long totalTasks = taskService.count();
        data.put("totalTasks", totalTasks);
        
        // 待接取任务数
        long pendingTasks = taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getStatus, 0)
        );
        data.put("pendingTasks", pendingTasks);
        
        // 进行中任务数
        long inProgressTasks = taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getStatus, 1)
        );
        data.put("inProgressTasks", inProgressTasks);
        
        // 已完成任务数
        long completedTasks = taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getStatus, 2)
        );
        data.put("completedTasks", completedTasks);
        
        // 按分类统计任务数
        Map<String, Long> categoryStats = new HashMap<>();
        categoryStats.put("代取快递", taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getCategory, "代取快递")
        ));
        categoryStats.put("代买", taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getCategory, "代买")
        ));
        categoryStats.put("代送", taskService.count(
            new LambdaQueryWrapper<Task>().eq(Task::getCategory, "代送")
        ));
        data.put("categoryStats", categoryStats);
        
        return Result.success(data);
    }
}

