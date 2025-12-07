-- 创建数据库
CREATE DATABASE IF NOT EXISTS campusrunner DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campusrunner;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(100) NOT NULL COMMENT '密码（MD5加密）',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '手机号',
    `avatar` VARCHAR(255) COMMENT '头像路径',
    `role` INT DEFAULT 0 COMMENT '角色：0-普通用户，1-管理员',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 任务表
CREATE TABLE IF NOT EXISTS `task` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID',
    `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `category` VARCHAR(50) COMMENT '任务分类：代取快递、代买、代送等',
    `reward` DECIMAL(10,2) NOT NULL COMMENT '酬金',
    `location` VARCHAR(200) COMMENT '地点',
    `image` VARCHAR(255) COMMENT '任务图片路径',
    `publisher_id` BIGINT NOT NULL COMMENT '发布者ID',
    `receiver_id` BIGINT COMMENT '接取者ID',
    `status` INT DEFAULT 0 COMMENT '状态：0-待接取，1-进行中，2-已完成，3-已取消',
    `deadline` DATETIME COMMENT '截止时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_publisher` (`publisher_id`),
    INDEX `idx_receiver` (`receiver_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_category` (`category`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

-- 插入测试数据
-- 测试用户：admin/admin123
INSERT INTO `user` (`username`, `password`, `nickname`, `email`, `role`) VALUES
('admin', '0192023a7bbd73250516f069df18b500', '管理员', 'admin@example.com', 1),
('user1', '0192023a7bbd73250516f069df18b500', '用户1', 'user1@example.com', 0),
('user2', '0192023a7bbd73250516f069df18b500', '用户2', 'user2@example.com', 0);

-- 注意：密码 '0192023a7bbd73250516f069df18b500' 是 'admin123' 的 MD5 值







