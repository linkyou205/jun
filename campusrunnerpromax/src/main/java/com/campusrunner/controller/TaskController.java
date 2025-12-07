package com.campusrunner.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campusrunner.common.Result;
import com.campusrunner.entity.Task;
import com.campusrunner.entity.User;
import com.campusrunner.service.TaskService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/list")
    public Result<Page<Task>> list(@RequestParam(defaultValue = "1") Integer pageNum,
                                   @RequestParam(defaultValue = "10") Integer pageSize,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) String category,
                                   @RequestParam(required = false) Integer status,
                                   @RequestParam(required = false) Long publisherId,
                                   @RequestParam(required = false) Long receiverId) {
        Page<Task> page = taskService.searchTasks(keyword, category, status, publisherId, receiverId, pageNum, pageSize);
        return Result.success(page);
    }

    @GetMapping("/{id}")
    public Result<Task> getById(@PathVariable Long id) {
        Task task = taskService.getById(id);
        return Result.success(task);
    }

    @PostMapping("/add")
    @Transactional
    public Result<String> add(@RequestBody Task task, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }
        task.setPublisherId(user.getId());
        task.setStatus(0);
        task.setCreateTime(LocalDateTime.now());
        task.setUpdateTime(LocalDateTime.now());
        taskService.save(task);
        return Result.success("发布成功");
    }

    @PutMapping("/update")
    @Transactional
    public Result<String> update(@RequestBody Task task) {
        task.setUpdateTime(LocalDateTime.now());
        taskService.updateById(task);
        return Result.success("更新成功");
    }

    @DeleteMapping("/{id}")
    @Transactional
    public Result<String> delete(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }
        // 只有管理员可以删除任务
        if (user.getRole() == null || user.getRole() != 1) {
            return Result.error("权限不足，只有管理员可以删除任务");
        }
        Task task = taskService.getById(id);
        if (task == null) {
            return Result.error("任务不存在");
        }
        taskService.removeById(id);
        return Result.success("删除成功");
    }

    @PostMapping("/receive/{id}")
    @Transactional
    public Result<String> receive(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return Result.error("请先登录");
        }
        Task task = taskService.getById(id);
        if (task == null) {
            return Result.error("任务不存在");
        }
        if (task.getStatus() != 0) {
            return Result.error("任务已被接取或已完成");
        }
        task.setReceiverId(user.getId());
        task.setStatus(1);
        task.setUpdateTime(LocalDateTime.now());
        taskService.updateById(task);
        return Result.success("接取成功");
    }

    @PostMapping("/complete/{id}")
    @Transactional
    public Result<String> complete(@PathVariable Long id) {
        Task task = taskService.getById(id);
        if (task == null) {
            return Result.error("任务不存在");
        }
        task.setStatus(2);
        task.setUpdateTime(LocalDateTime.now());
        taskService.updateById(task);
        return Result.success("任务已完成");
    }
}

