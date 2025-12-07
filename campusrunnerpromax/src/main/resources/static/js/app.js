let currentPage = 1;
let pageSize = 4;
let currentUser = null;

// 页面加载时检查登录状态
$(document).ready(function() {
    checkLogin();
    loadTasks();
    
    // 图片预览
    $('#taskImage').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').html(`<img src="${e.target.result}" class="img-thumbnail" style="max-width: 200px;">`);
            };
            reader.readAsDataURL(file);
        }
    });
});

// 检查登录状态
function checkLogin() {
    $.get('/api/user/info', function(res) {
        if (res.code === 200 && res.data) {
            currentUser = res.data;
            $('#loginNav').addClass('d-none');
            $('#userNav').removeClass('d-none');
            $('#myTasksNav').removeClass('d-none');
            $('#userInfo').text(res.data.nickname || res.data.username);
        } else {
            currentUser = null;
            $('#loginNav').removeClass('d-none');
            $('#userNav').addClass('d-none');
            $('#myTasksNav').addClass('d-none');
        }
    }).fail(function() {
        currentUser = null;
        $('#loginNav').removeClass('d-none');
        $('#userNav').addClass('d-none');
    });
}

// 显示登录模态框
function showLoginModal() {
    $('#loginModal').modal('show');
}

// 显示注册模态框
function showRegisterModal() {
    $('#registerForm')[0].reset();
    $('#registerAvatarPreview').attr('src', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3Ctext x='50' y='65' text-anchor='middle' font-size='40' fill='%23999'%3E👤%3C/text%3E%3C/svg%3E");
    $('#registerModal').modal('show');
}

// 预览注册时的头像
function previewRegisterAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#registerAvatarPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 显示发布任务模态框
function showPublishModal() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    $('#publishForm')[0].reset();
    $('#imagePreview').empty();
    $('#publishModal').modal('show');
}

// 登录
function login() {
    const formData = {
        username: $('input[name="username"]', '#loginForm').val(),
        password: $('input[name="password"]', '#loginForm').val()
    };
    
    $.post('/api/user/login', formData, function(res) {
        if (res.code === 200) {
            alert('登录成功');
            $('#loginModal').modal('hide');
            checkLogin();
            loadTasks();
        } else {
            alert(res.message || '登录失败');
        }
    });
}

// 校验邮箱
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: true, message: '' }; // 邮箱可以为空
    }
    const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
        return { valid: false, message: '邮箱格式不正确，请输入有效的邮箱地址' };
    }
    return { valid: true, message: '' };
}

// 校验手机号
function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return { valid: true, message: '' }; // 手机号可以为空
    }
    const phonePattern = /^1[3-9]\d{9}$/;
    if (!phonePattern.test(phone.trim())) {
        return { valid: false, message: '手机号格式不正确，请输入11位有效手机号（1开头的11位数字）' };
    }
    return { valid: true, message: '' };
}

// 注册
function register() {
    const formData = {
        username: $('input[name="username"]', '#registerForm').val(),
        password: $('input[name="password"]', '#registerForm').val(),
        nickname: $('input[name="nickname"]', '#registerForm').val(),
        email: $('input[name="email"]', '#registerForm').val(),
        phone: $('input[name="phone"]', '#registerForm').val()
    };
    
    // 校验必填字段
    if (!formData.username || formData.username.trim() === '') {
        alert('用户名不能为空');
        return;
    }
    if (!formData.password || formData.password.trim() === '') {
        alert('密码不能为空');
        return;
    }
    if (formData.password.length < 6) {
        alert('密码长度至少6位');
        return;
    }
    if (!formData.nickname || formData.nickname.trim() === '') {
        alert('昵称不能为空');
        return;
    }
    
    // 校验邮箱
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
        alert(emailValidation.message);
        return;
    }
    
    // 校验手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
        alert(phoneValidation.message);
        return;
    }
    
    // 如果有上传头像，先上传头像
    const avatarFile = $('#registerAvatarUpload')[0].files[0];
    if (avatarFile) {
        const formData2 = new FormData();
        formData2.append('file', avatarFile);
        
        $.ajax({
            url: '/api/file/upload',
            type: 'POST',
            data: formData2,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res.code === 200) {
                    formData.avatar = res.data;
                    submitRegister(formData);
                } else {
                    alert('头像上传失败: ' + res.message);
                }
            }
        });
    } else {
        submitRegister(formData);
    }
}

// 提交注册
function submitRegister(formData) {
    $.ajax({
        url: '/api/user/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(res) {
            if (res.code === 200) {
                alert('注册成功，请登录');
                $('#registerModal').modal('hide');
                showLoginModal();
            } else {
                alert(res.message || '注册失败');
            }
        }
    });
}

// 退出
function logout() {
    $.post('/api/user/logout', function(res) {
        if (res.code === 200) {
            currentUser = null;
            checkLogin();
            loadTasks();
        }
    });
}

// 加载任务列表
function loadTasks(page = 1) {
    currentPage = page;
    const keyword = $('#keyword').val();
    const category = $('#category').val();
    const status = $('#status').val();
    
    $.get('/api/task/list', {
        pageNum: page,
        pageSize: pageSize,
        keyword: keyword,
        category: category,
        status: status
    }, function(res) {
        if (res.code === 200) {
            renderTasks(res.data.records);
            renderPagination(res.data);
        }
    });
}

// 搜索任务
function searchTasks() {
    loadTasks(1);
}

// 渲染任务列表
function renderTasks(tasks) {
    let html = '';
    if (tasks.length === 0) {
        html = '<div class="alert alert-info">暂无任务</div>';
    } else {
        tasks.forEach(task => {
            const statusText = ['待接取', '进行中', '已完成', '已取消'][task.status] || '未知';
            const statusClass = `status-${task.status}`;
            html += `
                <div class="card task-card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h5 class="card-title">${task.title}</h5>
                                <p class="card-text text-muted">${task.description}</p>
                                <div class="mb-2">
                                    <span class="badge bg-secondary me-2">${task.category}</span>
                                    <span class="status-badge ${statusClass}">${statusText}</span>
                                </div>
                                <p class="card-text">
                                    <i class="fas fa-map-marker-alt"></i> ${task.location || '未指定'}
                                    <span class="reward-badge ms-3">¥${task.reward}</span>
                                </p>
                            </div>
                            <div class="col-md-4 text-end">
                                ${task.image ? `<img src="${task.image}" class="img-thumbnail mb-2" style="max-width: 150px;">` : ''}
                                <div>
                                    ${task.status === 0 && currentUser ? 
                                        `<button class="btn btn-primary btn-sm me-1" onclick="receiveTask(${task.id})">接取任务</button>` : ''}
                                    ${task.status === 1 && currentUser && task.receiverId === currentUser.id ? 
                                        `<button class="btn btn-success btn-sm me-1" onclick="completeTask(${task.id})">完成任务</button>` : ''}
                                    ${currentUser && currentUser.role === 1 ? 
                                        `<button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})" title="管理员删除"><i class="fas fa-trash"></i> 删除</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    $('#taskList').html(html);
}

// 渲染分页
function renderPagination(pageData) {
    const totalPages = pageData.pages;
    const current = pageData.current;
    
    let html = '<ul class="pagination justify-content-center">';
    
    // 上一页
    html += `<li class="page-item ${current === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="loadTasks(${current - 1}); return false;">上一页</a>
    </li>`;
    
    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= current - 2 && i <= current + 2)) {
            html += `<li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadTasks(${i}); return false;">${i}</a>
            </li>`;
        } else if (i === current - 3 || i === current + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // 下一页
    html += `<li class="page-item ${current === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="loadTasks(${current + 1}); return false;">下一页</a>
    </li>`;
    
    html += '</ul>';
    $('#pagination').html(html);
}

// 发布任务
function publishTask() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    
    const formData = {
        title: $('input[name="title"]', '#publishForm').val(),
        description: $('textarea[name="description"]', '#publishForm').val(),
        category: $('select[name="category"]', '#publishForm').val(),
        reward: parseFloat($('input[name="reward"]', '#publishForm').val()),
        location: $('input[name="location"]', '#publishForm').val(),
        deadline: $('input[name="deadline"]', '#publishForm').val()
    };
    
    const fileInput = $('#taskImage')[0];
    if (fileInput.files.length > 0) {
        // 先上传图片
        const formData2 = new FormData();
        formData2.append('file', fileInput.files[0]);
        
        $.ajax({
            url: '/api/file/upload',
            type: 'POST',
            data: formData2,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res.code === 200) {
                    formData.image = res.data;
                    submitTask(formData);
                } else {
                    alert('图片上传失败: ' + res.message);
                }
            }
        });
    } else {
        submitTask(formData);
    }
}

// 提交任务
function submitTask(formData) {
    $.ajax({
        url: '/api/task/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(res) {
            if (res.code === 200) {
                alert('发布成功');
                $('#publishModal').modal('hide');
                loadTasks();
            } else {
                alert(res.message || '发布失败');
            }
        }
    });
}

// 接取任务
function receiveTask(id) {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    if (confirm('确定要接取这个任务吗？')) {
        $.post(`/api/task/receive/${id}`, function(res) {
            if (res.code === 200) {
                alert('接取成功');
                loadTasks();
            } else {
                alert(res.message || '接取失败');
            }
        });
    }
}

// 完成任务
function completeTask(id) {
    if (confirm('确定要完成这个任务吗？')) {
        $.post(`/api/task/complete/${id}`, function(res) {
            if (res.code === 200) {
                alert('任务已完成');
                loadTasks();
            } else {
                alert(res.message || '操作失败');
            }
        });
    }
}

// 删除任务（仅管理员）
function deleteTask(id) {
    if (!currentUser || currentUser.role !== 1) {
        alert('权限不足，只有管理员可以删除任务');
        return;
    }
    if (confirm('确定要删除这个任务吗？删除后无法恢复！')) {
        $.ajax({
            url: `/api/task/${id}`,
            type: 'DELETE',
            success: function(res) {
                if (res.code === 200) {
                    alert('删除成功');
                    loadTasks();
                } else {
                    alert(res.message || '删除失败');
                }
            },
            error: function() {
                alert('删除失败，请稍后重试');
            }
        });
    }
}

// 显示统计
function showStatistics() {
    $('#statisticsModal').modal('show');
    $('#statisticsContent').html('<div class="text-center"><div class="spinner-border"></div></div>');
    
    $.get('/api/statistics/overview', function(res) {
        if (res.code === 200) {
            const data = res.data;
            let html = `
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3>${data.totalUsers}</h3>
                                <p class="text-muted">总用户数</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3>${data.totalTasks}</h3>
                                <p class="text-muted">总任务数</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3>${data.pendingTasks}</h3>
                                <p class="text-muted">待接取</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3>${data.completedTasks}</h3>
                                <p class="text-muted">已完成</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="chart-wrapper">
                            <div id="categoryChart" style="width: 700px; height: 600px; max-width: 100%;"></div>
                        </div>
                    </div>
                </div>
            `;
            $('#statisticsContent').html(html);
            
            // 初始化图表的函数
            function initChart() {
                const chartElement = document.getElementById('categoryChart');
                if (!chartElement) {
                    setTimeout(initChart, 50);
                    return;
                }
                
                // 如果图表已存在，先销毁
                const existingChart = echarts.getInstanceByDom(chartElement);
                if (existingChart) {
                    existingChart.dispose();
                }
                
                // 绘制图表
                const chart = echarts.init(chartElement);
                const option = {
                    title: {
                        text: '任务分类统计',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'bold'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 20,
                        left: 'center'
                    },
                    series: [{
                        name: '任务数',
                        type: 'pie',
                        radius: ['30%', '65%'],
                        center: ['50%', '55%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            formatter: '{b}\n{c} ({d}%)',
                            fontSize: 14
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: Object.keys(data.categoryStats).map(key => ({
                            value: data.categoryStats[key],
                            name: key
                        }))
                    }]
                };
                chart.setOption(option);
                
                // 响应式调整
                const resizeHandler = function() {
                    chart.resize();
                };
                $(window).off('resize', resizeHandler).on('resize', resizeHandler);
            }
            
            // 等待模态框完全显示后再初始化图表
            $('#statisticsModal').off('shown.bs.modal').on('shown.bs.modal', function() {
                setTimeout(initChart, 100);
            });
            
            // 如果模态框已经显示，直接初始化
            if ($('#statisticsModal').hasClass('show')) {
                setTimeout(initChart, 200);
            }
        }
    });
}

// 显示我的任务
function showMyTasks() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    $('#myTasksModal').modal('show');
    loadPublishedTasks();
    loadReceivedTasks();
}

// 加载我发布的任务
function loadPublishedTasks() {
    $.get('/api/task/list', {
        pageNum: 1,
        pageSize: 100,
        publisherId: currentUser.id
    }, function(res) {
        if (res.code === 200) {
            const tasks = res.data.records.filter(t => t.publisherId === currentUser.id);
            renderMyTasks(tasks, 'publishedTasks');
        }
    });
}

// 加载我接取的任务
function loadReceivedTasks() {
    $.get('/api/task/list', {
        pageNum: 1,
        pageSize: 100
    }, function(res) {
        if (res.code === 200) {
            const tasks = res.data.records.filter(t => t.receiverId === currentUser.id);
            renderMyTasks(tasks, 'receivedTasks');
        }
    });
}

// 渲染我的任务列表
function renderMyTasks(tasks, containerId) {
    let html = '';
    if (tasks.length === 0) {
        html = '<div class="alert alert-info">暂无任务</div>';
    } else {
        tasks.forEach(task => {
            const statusText = ['待接取', '进行中', '已完成', '已取消'][task.status] || '未知';
            const statusClass = `status-${task.status}`;
            html += `
                <div class="card task-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h5 class="card-title">${task.title}</h5>
                                <p class="card-text text-muted">${task.description}</p>
                                <div class="mb-2">
                                    <span class="badge bg-secondary me-2">${task.category}</span>
                                    <span class="status-badge ${statusClass}">${statusText}</span>
                                    <span class="reward-badge ms-2">¥${task.reward}</span>
                                </div>
                                <small class="text-muted">
                                    <i class="fas fa-map-marker-alt"></i> ${task.location || '未指定'} | 
                                    发布时间：${new Date(task.createTime).toLocaleString()}
                                </small>
                            </div>
                            ${task.image ? `<img src="${task.image}" class="img-thumbnail ms-3" style="max-width: 120px;">` : ''}
                        </div>
                        ${task.status === 1 && task.receiverId === currentUser.id ? 
                            `<button class="btn btn-success btn-sm mt-2" onclick="completeTask(${task.id}); $('#myTasksModal').modal('hide');">完成任务</button>` : ''}
                    </div>
                </div>
            `;
        });
    }
    $('#' + containerId).html(html);
}

// 显示个人中心
function showProfile() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    $('#profileUsername').val(currentUser.username);
    $('#profileNickname').val(currentUser.nickname || '');
    $('#profileEmail').val(currentUser.email || '');
    $('#profilePhone').val(currentUser.phone || '');
    if (currentUser.avatar) {
        $('#avatarPreview').attr('src', currentUser.avatar);
    } else {
        $('#avatarPreview').attr('src', "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3Ctext x='50' y='65' text-anchor='middle' font-size='40' fill='%23999'%3E👤%3C/text%3E%3C/svg%3E");
    }
    $('#profileModal').modal('show');
}

// 预览头像
function previewAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#avatarPreview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 更新个人资料
function updateProfile() {
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    
    const formData = {
        nickname: $('#profileNickname').val(),
        email: $('#profileEmail').val(),
        phone: $('#profilePhone').val()
    };
    
    // 校验邮箱
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
        alert(emailValidation.message);
        return;
    }
    
    // 校验手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
        alert(phoneValidation.message);
        return;
    }
    
    // 如果有上传头像
    const avatarFile = $('#avatarUpload')[0].files[0];
    if (avatarFile) {
        const formData2 = new FormData();
        formData2.append('file', avatarFile);
        
        $.ajax({
            url: '/api/file/upload',
            type: 'POST',
            data: formData2,
            processData: false,
            contentType: false,
            success: function(res) {
                if (res.code === 200) {
                    formData.avatar = res.data;
                    submitProfileUpdate(formData);
                } else {
                    alert('头像上传失败: ' + res.message);
                }
            }
        });
    } else {
        submitProfileUpdate(formData);
    }
}

// 提交个人资料更新
function submitProfileUpdate(formData) {
    $.ajax({
        url: '/api/user/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(res) {
            if (res.code === 200) {
                alert('更新成功');
                $('#profileModal').modal('hide');
                checkLogin(); // 重新获取用户信息
            } else {
                alert(res.message || '更新失败');
            }
        }
    });
}

// 显示帮助中心
function showHelp() {
    $('#helpModal').modal('show');
}

