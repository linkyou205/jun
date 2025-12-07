package com.campusrunner.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("task")
public class Task {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private String category; // 代取快递、代买、代送等
    private BigDecimal reward; // 酬金
    private String location;
    private String image;
    private Long publisherId; // 发布者ID
    private Long receiverId; // 接取者ID
    private Integer status; // 0-待接取 1-进行中 2-已完成 3-已取消
    private LocalDateTime deadline;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}






