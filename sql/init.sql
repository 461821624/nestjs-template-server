create table if not exists `system_users`(
    id          bigint auto_increment comment '用户ID',
    username    varchar(30)                            not null comment '用户账号',
    password    varchar(100) default ''                not null comment '密码',
    nickname    varchar(30)                            not null comment '用户昵称',
    remark      varchar(500)                           null comment '备注',
    dept_id     bigint                                 null comment '部门ID',
    post_ids    varchar(255)                           null comment '岗位编号数组',
    email       varchar(50)  default ''                null comment '用户邮箱',
    mobile      varchar(11)  default ''                null comment '手机号码',
    sex         tinyint      default 0                 null comment '用户性别',
    avatar      varchar(100) default ''                null comment '头像地址',
    status      tinyint      default 0                 not null comment '帐号状态（0正常 1停用）',
    login_ip    varchar(50)  default ''                null comment '最后登录IP',
    login_date  datetime                               null comment '最后登录时间',
    creator     varchar(64)  default ''                null comment '创建者',
    create_time datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updater     varchar(64)  default ''                null comment '更新者',
    update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted     tinyint      default 0             not null comment '是否删除',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `idx_username`(`username` ASC, `update_time` ASC ) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 119 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表';
insert into `system_users` (`id`, `username`, `password`,`nickname`, `remark`, `dept_id`,`post_ids`,`email`,`mobile`,`sex`,`avatar`,`status`,`login_ip`,`login_date`,`creator`,`create_time`,`updater`,`update_time`,`deleted`)
values (1, 'admin','$2a$10$0acJOIk2D25/oC87nyclE..0lzeu9DtQ/n3geP4fkun/zIVRhHJIO','haha','管理员',1,'[1]','123@163.com','13912345678',0,'https://img.pkdoutu.com/production/uploads/image/2022/01/02/20220102105000_CLgSsy.gif',0,'127.0.0.1', '2022-07-09 17:40:26','admin','2022-07-09 17:40:26','admin','2022-07-09 17:40:26',0);

create table if not exists `system_menu`(
     id          bigint auto_increment comment '菜单ID',
     name       varchar(50)                            not null comment '菜单名称',
     path       varchar(200) null comment '路由地址',
     role       varchar(100) default ''                not null comment '权限标识',
     type       tinyint(4)                            not null comment '菜单类型',
     sort       int(11)                           not null comment '显示顺序',
     parent_id  bigint(20)                               not null comment '父菜单ID',
     icon       varchar(100)                           null comment 'icon',
     component       varchar(255)  default ''                null comment '组件路径',
     ignoreCache      tinyint(4)  default 0               not null comment '是否缓存',
     hideInMenu         tinyint(4)      default 0                not null comment '是否显示',
     locale      varchar(255) default ''                null comment '语言包键名',
     status      tinyint      default 0                 not null comment '菜单状态（0正常 1停用）',
     creator     varchar(64)  default ''                null comment '创建者',
     create_time datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
     updater     varchar(64)  default ''                null comment '更新者',
     update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
     deleted     tinyint      default 0             not null comment '是否删除',
     PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表';
insert into `system_menu` (`id`, `name`, `path`,`role`, `type`, `sort`,`parent_id`,`icon`,`component`,`ignoreCache`,`hideInMenu`,`status`,`locale`,`creator`,`create_time`,`updater`,`update_time`,`deleted`)
values (1, 'System','/system','',1,10,0,'icon-settings','',0,1,0,'system.manager','admin', '2022-07-09 17:40:26','admin','2022-07-09 17:40:26',0);
insert into `system_menu` (`id`, `name`, `path`,`role`, `type`, `sort`,`parent_id`,`icon`,`component`,`ignoreCache`,`hideInMenu`,`status`,`locale`,`creator`,`create_time`,`updater`,`update_time`,`deleted`)
values (101, 'Menu','menu','',2,1,1,'','system/menu/index',0,1,0,'menu.manager','admin', '2022-07-09 17:40:26','admin','2022-07-09 17:40:26',0)