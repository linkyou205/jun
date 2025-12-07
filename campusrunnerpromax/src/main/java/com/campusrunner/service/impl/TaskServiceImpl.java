package com.campusrunner.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campusrunner.entity.Task;
import com.campusrunner.mapper.TaskMapper;
import com.campusrunner.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {

    @Override
    public Page<Task> searchTasks(String keyword, String category, Integer status, Long publisherId, Long receiverId, Integer pageNum, Integer pageSize) {
        Page<Task> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Task> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Task::getTitle, keyword)
                    .or().like(Task::getDescription, keyword)
                    .or().like(Task::getLocation, keyword));
        }
        
        if (StringUtils.hasText(category)) {
            wrapper.eq(Task::getCategory, category);
        }
        
        if (status != null) {
            wrapper.eq(Task::getStatus, status);
        }
        
        if (publisherId != null) {
            wrapper.eq(Task::getPublisherId, publisherId);
        }
        
        if (receiverId != null) {
            wrapper.eq(Task::getReceiverId, receiverId);
        }
        
        wrapper.orderByDesc(Task::getCreateTime);
        
        return this.page(page, wrapper);
    }
}


