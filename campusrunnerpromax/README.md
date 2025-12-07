# 校园跑腿系统

一个基于 Spring Boot + MyBatis-Plus 的校园跑腿任务管理全栈 Web 应用系统

## 项目简介

校园跑腿系统是一个面向校园生活的任务发布与接取平台。学生可以发布跑腿任务（如代取快递、代买、代送等），其他学生可以接取任务并完成，实现校园内的互助服务。

**学号：** 23224220  
**姓名：** 黄小军

## 技术栈

### 后端
- **Spring Boot 3.1.5** - 核心框架，简化配置和开发
- **MyBatis-Plus 3.5.5** - 持久层框架，简化 CRUD 操作
- **MySQL** - 关系型数据库
- **Maven** - 项目构建和依赖管理工具
- **Lombok** - 简化代码，自动生成 getter/setter 等方法

### 前端
- **HTML5 + CSS3 + JavaScript** - 前端基础技术
- **Bootstrap 5.3.0** - 响应式 UI 框架
- **jQuery 3.7.0** - JavaScript 库，简化 DOM 操作和 AJAX
- **ECharts 5.4.3** - 数据可视化图表库
- **Font Awesome 6.4.0** - 图标库

## 功能模块

### 1. 用户认证与授权模块 ✅

**功能特性：**
- 用户注册（用户名、密码、昵称为必填项，支持上传头像）
- 用户登录（Session 会话管理）
- 用户退出登录
- 登录状态实时检查
- 密码 MD5 加密存储
- 字段格式校验（邮箱、手机号）

**SSM 知识点体现：**
- `@RestController` 处理 RESTful API 请求
- `@Service` 实现业务逻辑层
- `@Autowired` 依赖注入
- MyBatis-Plus `BaseMapper` 实现数据库操作
- `HttpSession` 会话管理
- 前后端数据校验（邮箱、手机号正则表达式）

### 2. 任务管理模块 ✅

**功能特性：**
- 任务发布（标题、描述、分类、酬金、地点、截止时间、图片）
- 任务列表展示（每页 4 个任务）
- 任务搜索（关键词、分类、状态多条件筛选）
- 分页查询（MyBatis-Plus 分页插件）
- 任务接取（只能接取待接取状态的任务）
- 任务完成（接取者可以标记任务完成）
- 任务删除（仅管理员权限）
- 我的任务查看（我发布的、我接取的）

**SSM 知识点体现：**
- `@RequestMapping` 路径映射
- `@PathVariable` 传递路径参数 ID
- `@RequestParam` 接收查询参数
- MyBatis-Plus 动态 SQL（`LambdaQueryWrapper`）
- `@Transactional` 事务管理（任务状态更新）
- 分页插件 `PaginationInnerInterceptor`
- 条件构造器实现多条件查询

### 3. 文件上传模块 ✅

**功能特性：**
- 图片上传（任务图片、用户头像）
- 文件存储到服务器指定目录
- 文件路径存储到数据库
- 文件访问路径配置

**SSM 知识点体现：**
- `MultipartFile` 处理文件上传请求
- 文件保存到服务器指定目录
- 文件路径存储到数据库
- 静态资源映射配置

### 4. 搜索与分页模块 ✅

**功能特性：**
- 多条件搜索（关键词、分类、状态）
- 分页显示（每页 4 条记录）
- 按用户筛选（我发布的、我接取的）
- 动态 SQL 查询

**SSM 知识点体现：**
- `@RequestParam` 接收搜索参数
- MyBatis-Plus 条件构造器 `LambdaQueryWrapper`
- 动态 SQL 构建
- 分页查询 `Page<T>`

### 5. 数据统计模块 ✅

**功能特性：**
- 用户总数统计
- 任务总数统计
- 任务状态统计（待接取、进行中、已完成）
- 任务分类统计
- 图表可视化展示（ECharts 环形图）

**SSM 知识点体现：**
- `@GetMapping` 提供数据统计接口
- MyBatis-Plus 聚合查询（`count`）
- 返回 JSON 格式数据
- 复杂 SQL 统计查询

### 6. 个人中心模块 ✅

**功能特性：**
- 查看个人信息
- 修改个人资料（昵称、邮箱、手机号）
- 上传和更换头像
- 字段格式校验（邮箱、手机号）

## 项目结构

```
campusrunnerpromax/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/campusrunner/
│   │   │       ├── CampusrunnerpromaxApplication.java  # 启动类
│   │   │       ├── config/          # 配置类
│   │   │       │   ├── MybatisPlusConfig.java         # MyBatis-Plus 配置（分页插件）
│   │   │       │   └── WebConfig.java                 # Web 配置（跨域、静态资源）
│   │   │       ├── controller/      # 控制器层（RESTful API）
│   │   │       │   ├── UserController.java            # 用户相关接口
│   │   │       │   ├── TaskController.java            # 任务相关接口
│   │   │       │   ├── FileController.java            # 文件上传接口
│   │   │       │   └── StatisticsController.java     # 统计接口
│   │   │       ├── service/         # 服务层接口
│   │   │       │   ├── UserService.java
│   │   │       │   ├── TaskService.java
│   │   │       │   └── impl/        # 服务层实现
│   │   │       │       ├── UserServiceImpl.java
│   │   │       │       └── TaskServiceImpl.java
│   │   │       ├── mapper/          # 数据访问层（MyBatis-Plus）
│   │   │       │   ├── UserMapper.java
│   │   │       │   └── TaskMapper.java
│   │   │       ├── entity/         # 实体类（对应数据库表）
│   │   │       │   ├── User.java
│   │   │       │   └── Task.java
│   │   │       ├── common/         # 通用类
│   │   │       │   └── Result.java                    # 统一响应结果封装
│   │   │       └── util/          # 工具类
│   │   │           └── Md5Util.java                   # MD5 加密工具
│   │   └── resources/
│   │       ├── application.properties  # 配置文件（数据库、MyBatis-Plus、文件上传等）
│   │       ├── db/
│   │       │   └── init.sql        # 数据库初始化脚本（建表、测试数据）
│   │       └── static/            # 静态资源
│   │           ├── index.html     # 主页面
│   │           ├── css/
│   │           │   └── style.css  # 自定义样式
│   │           └── js/
│   │               └── app.js      # 前端 JavaScript 逻辑
│   └── test/                      # 测试代码
├── pom.xml                        # Maven 配置文件
└── README.md                      # 项目说明文档
```

## 快速开始

### 1. 环境要求

- **JDK 17+**
- **Maven 3.6+**
- **MySQL 5.7+** 或 **MySQL 8.0+**
- **IDE**（IntelliJ IDEA 推荐）

### 2. 数据库配置

#### 步骤 1：创建数据库

使用 MySQL 客户端或命令行创建数据库：

```sql
CREATE DATABASE campusrunner DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 步骤 2：执行初始化脚本

在 MySQL 中执行 `src/main/resources/db/init.sql` 文件中的所有 SQL 语句，或者使用命令行：

```bash
mysql -u root -p campusrunner < src/main/resources/db/init.sql
```

#### 步骤 3：修改数据库连接配置

编辑 `src/main/resources/application.properties` 文件，修改数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusrunner?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=123456
```

**注意：** 请根据你的实际 MySQL 配置修改用户名和密码。

### 3. 文件上传目录配置

修改 `application.properties` 中的文件上传路径：

```properties
file.upload.path=D:/uploads/campusrunner/
```

**重要提示：**
- 请确保该目录存在，如果不存在需要手动创建
- Windows 路径示例：`D:/uploads/campusrunner/`
- Linux/Mac 路径示例：`/tmp/uploads/campusrunner/`
- 路径末尾必须有斜杠 `/`

### 4. 运行项目

#### 方式一：使用 IntelliJ IDEA

1. 导入项目：`File` → `Open` → 选择项目根目录
2. 等待 Maven 依赖下载完成（首次需要几分钟）
3. 右键点击 `CampusrunnerpromaxApplication.java` → `Run`

#### 方式二：使用 Maven 命令行

```bash
mvn clean compile
mvn spring-boot:run
```

### 5. 访问系统

启动成功后，打开浏览器访问：

```
http://localhost:8080
```

### 6. 测试账号

系统已预置以下测试账号（所有账号密码都是 `admin123`）：

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | admin123 | 管理员 | 可以删除任务 |
| user1 | admin123 | 普通用户 | 可发布和接取任务 |
| user2 | admin123 | 普通用户 | 可发布和接取任务 |

## API 接口文档

### 用户相关接口

| 接口 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/user/register` | POST | 用户注册（支持头像上传） | 公开 |
| `/api/user/login` | POST | 用户登录 | 公开 |
| `/api/user/logout` | POST | 退出登录 | 需登录 |
| `/api/user/info` | GET | 获取当前用户信息 | 需登录 |
| `/api/user/update` | PUT | 更新个人信息（支持头像上传） | 需登录 |

### 任务相关接口

| 接口 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/task/list` | GET | 获取任务列表（分页，每页4条） | 公开 |
| `/api/task/{id}` | GET | 获取任务详情 | 公开 |
| `/api/task/add` | POST | 发布任务 | 需登录 |
| `/api/task/update` | PUT | 更新任务 | 需登录 |
| `/api/task/{id}` | DELETE | 删除任务 | 需管理员 |
| `/api/task/receive/{id}` | POST | 接取任务 | 需登录 |
| `/api/task/complete/{id}` | POST | 完成任务 | 需登录 |

### 文件相关接口

| 接口 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/file/upload` | POST | 上传文件（图片） | 需登录 |

### 统计相关接口

| 接口 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/statistics/overview` | GET | 获取数据统计 | 公开 |

## 核心知识点说明

### Spring MVC

- **`@RestController`** - RESTful API 控制器，自动将返回值转为 JSON
- **`@RequestMapping`** - 请求路径映射
- **`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`** - HTTP 方法映射
- **`@RequestParam`** - 接收请求参数（查询参数、表单参数）
- **`@PathVariable`** - 接收路径变量（如 `/api/task/{id}`）
- **`@RequestBody`** - 接收 JSON 请求体，自动绑定到对象
- **`HttpSession`** - 会话管理，存储用户登录状态

### Spring Core

- **`@Service`** - 服务层组件，标注业务逻辑类
- **`@Autowired`** - 依赖注入，自动装配 Bean
- **`@Transactional`** - 事务管理，确保数据一致性
- **`@Configuration`** - 配置类，定义 Bean 配置
- **`@Bean`** - 定义 Bean 对象

### MyBatis-Plus

- **`BaseMapper<T>`** - 基础 Mapper 接口，提供基础 CRUD 方法
- **`IService<T>`** - 服务接口，扩展更多业务方法
- **`LambdaQueryWrapper`** - Lambda 条件构造器，类型安全的 SQL 构建
- **`Page<T>`** - 分页对象，封装分页信息
- **`@TableName`** - 表名映射
- **`@TableId`** - 主键映射
- **`PaginationInnerInterceptor`** - 分页插件，自动实现分页查询

### 数据校验

- **前端校验** - JavaScript 实时校验，提升用户体验
- **后端校验** - Java 正则表达式校验，确保数据安全
- **格式校验** - 邮箱格式、手机号格式

## 功能演示

### 1. 用户注册/登录
- 点击右上角"注册"按钮
- 填写必填信息（用户名、密码、昵称）
- **上传头像**（可选）
- 可选填写邮箱和手机号（有格式校验）
- 注册成功后自动跳转到登录页面
- 登录成功后显示用户信息和功能菜单

### 2. 任务发布
- 登录后点击导航栏"发布任务"或用户下拉菜单中的"发布任务"
- 填写任务信息：标题、描述、分类、酬金、地点、截止时间
- 可选择上传任务图片
- 点击"发布"按钮提交

### 3. 任务搜索与浏览
- 使用搜索栏输入关键词搜索
- 选择分类筛选（代取快递、代买、代送）
- 选择状态筛选（待接取、进行中、已完成）
- 点击"搜索"按钮执行查询
- **每页显示 4 个任务**，可翻页浏览

### 4. 任务接取与完成
- 浏览任务列表，找到"待接取"状态的任务
- 点击"接取任务"按钮接取任务
- 接取后任务状态变为"进行中"
- 完成后点击"完成任务"按钮标记为完成

### 5. 我的任务
- 点击导航栏"我的任务"
- 查看"我发布的"任务列表
- 查看"我接取的"任务列表
- 可以完成已接取的任务

### 6. 个人中心
- 点击用户下拉菜单 → "个人中心"
- 查看和修改个人信息
- 上传和更换头像
- 修改昵称、邮箱、手机号（有格式校验）

### 7. 数据统计
- 点击导航栏"数据统计"
- 查看总用户数、总任务数、待接取、已完成等统计数据
- 查看任务分类统计图表（ECharts 环形图，居中显示）

### 8. 管理员功能
- 使用管理员账号登录
- 在任务列表中可以看到"删除"按钮
- 可以删除任意任务

### 9. 帮助中心
- 点击导航栏"帮助中心"
- 查看使用说明
- 查看常见问题解答

## 数据校验规则

### 必填字段
- **用户名**：不能为空
- **密码**：不能为空，长度至少 6 位
- **昵称**：不能为空

### 格式校验
- **邮箱**：格式为 `example@email.com`（可选，但填写时必须符合格式）
- **手机号**：11 位数字，1 开头，第二位为 3-9（可选，但填写时必须符合格式）

### 校验实现
- **前端校验**：JavaScript 实时校验，立即提示错误
- **后端校验**：Java 正则表达式校验，确保数据安全

## 注意事项

### 1. 数据库配置
- 确保 MySQL 服务已启动
- 数据库名称为 `campusrunner`
- 确保用户名和密码正确（默认配置：用户名 `root`，密码 `123456`）
- 如果端口不是 3306，需要修改配置中的端口号

### 2. 文件上传
- **必须创建文件上传目录**，否则上传功能会失败
- 默认路径：`D:/uploads/campusrunner/`
- 可以修改为其他路径，但要确保目录存在
- 路径末尾必须有斜杠 `/`

### 3. 端口配置
- 默认端口：`8080`
- 如果端口被占用，修改 `application.properties` 中的 `server.port`

### 4. 跨域配置
- 已配置允许所有来源（`CorsRegistry`）
- 生产环境建议修改为指定域名

### 5. 分页设置
- **每页显示 4 个任务**
- 可在 `app.js` 中修改 `pageSize` 变量

## 开发说明

### 代码规范
- 采用标准的三层架构：Controller → Service → Mapper
- 统一使用 RESTful API 设计风格
- 统一响应格式（`Result<T>` 封装）
- 代码注释完整，便于理解
- CSS 与 HTML 分离，样式统一管理

### 安全特性
- 密码 MD5 加密存储
- Session 会话管理
- 权限控制（管理员删除权限）
- SQL 注入防护（MyBatis 参数化查询）
- 前后端双重数据校验

### 项目亮点
- ✅ 完整的用户认证与授权（支持注册时上传头像）
- ✅ 丰富的任务管理功能
- ✅ 完善的搜索与分页（每页4条）
- ✅ 美观的数据可视化（ECharts 环形图）
- ✅ 响应式设计，适配不同屏幕
- ✅ 用户体验友好，操作流畅
- ✅ 代码结构清晰，易于维护
- ✅ CSS 与 HTML 分离，便于维护

## 符合期末大作业要求

本项目完全符合期末大作业的所有要求：

- ✅ **技术栈要求**：使用 Spring Boot 3.1.5 + MyBatis-Plus 3.5.5 + MySQL
- ✅ **功能模块要求**：实现了至少 5 个核心功能模块
- ✅ **知识点体现**：充分体现了 SSM/SpringBoot 的核心知识点
- ✅ **前后端交互**：完整的 Ajax 数据交互
- ✅ **代码质量**：结构清晰、分层合理、注释详细
- ✅ **用户体验**：界面美观、操作流畅、响应式设计
- ✅ **文件上传**：支持任务图片和用户头像上传
- ✅ **数据校验**：前后端双重校验，确保数据安全
- ✅ **分页功能**：每页显示 4 个任务
- ✅ **Footer**：页面底部包含"联系我们"链接

## 联系方式

如有问题，请联系：http://www.nchu.edu.cn

---

**© 23224220 校园跑腿系统**
