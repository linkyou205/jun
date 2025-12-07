package com.campusrunner.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.campusrunner.entity.Task;

public interface TaskService extends IService<Task> {
    Page<Task> searchTasks(String keyword, String category, Integer status, Long publisherId, Long receiverId, Integer pageNum, Integer pageSize);
}


