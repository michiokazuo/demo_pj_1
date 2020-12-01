/*
 Navicat Premium Data Transfer

 Source Server         : Local Host
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : project_1_task_assignment

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 01/12/2020 09:54:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for employee
-- ----------------------------
DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(12) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` int(0) NOT NULL,
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_user_role`(`role`) USING BTREE,
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of employee
-- ----------------------------
INSERT INTO `employee` VALUES (1, 'Phong Óc Chó', 'xuanphong10a@gmail.com', '0346902568', '$2a$10$H3RTDLlRFOylLqfe825CPuEcnUzBsnBW2KmDmCOSkPB2KHbudRT5u', 2, b'0');
INSERT INTO `employee` VALUES (2, 'Phạm Anh Nguyên', 'nguyen@gmail.com', '0323423523', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (3, 'DONG PHONG', 'xuanphong10a@gmail.com1', '03469025681', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (4, 'Phan Trọng Tình', 'tinh123@gmail.com', '0978598211', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (5, 'Nguyễn Mạnh Dũng', 'dungkuto@gmail.com', '123423523', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (6, 'Nguyễn Thành Đạt', 'dat123@gmail.com', '0345671722', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (7, 'Nguyên', 'anhphonghktm@gmail.com', '0991234565', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (8, 'Minh Vũ', 'minhvu@gmail.com', '03469025681', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (10, 'Nguyễn Thanh Tú', 'superman@gmail.com', '0389733235', '$2a$10$QLf3WAvLJRKK6HnUlbEF/.civdIZUYHJOLAKmTatE0pOyIW87xWEy', 1, b'0');
INSERT INTO `employee` VALUES (11, 'Đồng Xuân Phong', 'thienbinh2102000@gmail.com', '0978598212', '$2a$10$pzpWbH2Jx5kFAeK4PcUyGuUIVVUSU/6ma8GbkN3eWv0sU13L0IOwW', 1, b'0');
INSERT INTO `employee` VALUES (12, 'Dũng', 'dungloan@gmail.com', '0332122122', '$2a$10$LMyDW0cTGMuV6EqFho7yheufClDzB4jyThSOq1g0/YvHXZ9SUN3pS', 1, b'0');
INSERT INTO `employee` VALUES (13, 'Nguyễn Minh Tuấn', 'tuannm4002@sishustedu.vn', '0323774999', '$2a$10$pVtEfV9yAXqMM53T5OQ9wudcP.HjwWoi7dMSBKfdW8fF1D5X1poda', 1, b'0');
INSERT INTO `employee` VALUES (14, 'Nguyễn Thị Trang Nhung', 'trangnhung@gmail.com', '0983214888', '$2a$10$Kh5Mt9oUnjDc2MvFCO0LIu/WTEtWx5wNvUX7iKGa7iZ2LTJWGPvs6', 1, b'0');
INSERT INTO `employee` VALUES (15, 'Hoàng Nhật Minh', 'minhnhat_chitu@gmail.com', '0908220886', '$2a$10$5tLD1NzAS2dRHzcXsDFfTeQinVESGcGYhvGH/s2LhCt3R8gaOxGiG', 1, b'0');
INSERT INTO `employee` VALUES (16, 'Thuyết Đại Ca', 'daicathuyetlaso1@gmail.com', '0345678910', '$2a$10$1b2NpvWgOI8Eze37gZ4TzeQR69LUKw2ofch7tnRzwOtSPsD9kKBBa', 1, b'0');
INSERT INTO `employee` VALUES (17, 'Dũng Đệ Đệ', 'Dungnguloz@gmail.com', '0888888888', '$2a$10$f8pz/rHppXaLyJCTXbe5vusMl8y4UY5OmWEZYf4GqNC0gaPCjBAqW', 1, b'0');

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `create_date` date NOT NULL,
  `end_date` date NOT NULL,
  `complete_date` date NULL DEFAULT NULL,
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES (1, 'Web base Task Assignment', '2020-10-01', '2020-12-01', NULL, b'0');
INSERT INTO `project` VALUES (2, 'ThatFruit Web', '2020-10-29', '2020-11-30', NULL, b'1');
INSERT INTO `project` VALUES (3, 'ToDo List', '2020-10-29', '2020-11-29', '2020-11-24', b'0');
INSERT INTO `project` VALUES (4, 'BTL CNPM', '2020-11-24', '2020-12-24', NULL, b'0');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'ROLE_USER', 'Nhân viên');
INSERT INTO `role` VALUES (2, 'ROLE_ADMIN', 'Quản lý');

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `
description` mediumtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `create_date` date NOT NULL,
  `end_date` date NOT NULL,
  `complete_date` date NULL DEFAULT NULL,
  `project_id` int(0) NOT NULL COMMENT 'FK',
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_task_project`(`project_id`) USING BTREE,
  CONSTRAINT `fk_task_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task
-- ----------------------------
INSERT INTO `task` VALUES (1, 'Phân tích CSDL', 'tốt', '2020-10-06', '2020-10-30', '2020-10-16', 1, b'0');
INSERT INTO `task` VALUES (2, 'Thiết kế CSDL', NULL, '2020-10-08', '2020-10-30', '2020-10-09', 1, b'0');
INSERT INTO `task` VALUES (3, 'Thiết kế giao diện', 'Trang hiển thị công việc', '2020-10-08', '2020-10-30', '2020-10-15', 1, b'0');
INSERT INTO `task` VALUES (4, 'Phân tích hệ thống', NULL, '2020-10-10', '2020-10-30', '2020-10-16', 1, b'0');
INSERT INTO `task` VALUES (5, 'Vẽ biểu đồ ca SD', 'Xác định tác nhân', '2020-10-10', '2020-10-30', NULL, 1, b'0');
INSERT INTO `task` VALUES (6, 'Tính toán rủi ro', NULL, '2020-10-10', '2020-10-30', NULL, 1, b'0');
INSERT INTO `task` VALUES (7, 'Call API', NULL, '2020-10-12', '2020-10-30', '2020-10-15', 1, b'0');
INSERT INTO `task` VALUES (8, 'Hoàn thiện giao diện', 'UX\nUI', '2020-10-15', '2020-10-30', NULL, 1, b'0');
INSERT INTO `task` VALUES (10, 'Nâng cấp API', 'Làm bù', '2020-10-25', '2020-10-31', NULL, 1, b'0');
INSERT INTO `task` VALUES (11, 'Phân tích yêu cầu', 'Tổng quát & Chi tiết', '2020-10-29', '2020-11-05', NULL, 2, b'0');
INSERT INTO `task` VALUES (12, 'Demo SP', 'Chi tiết', '2020-10-29', '2020-10-31', NULL, 1, b'0');
INSERT INTO `task` VALUES (13, 'Phân tích thiết kế', NULL, '2020-10-29', '2020-10-30', NULL, 2, b'0');
INSERT INTO `task` VALUES (14, 'Phân tích yêu cầu', NULL, '2020-10-29', '2020-11-05', '2020-10-29', 3, b'0');
INSERT INTO `task` VALUES (15, 'Vẽ biểu đồ', 'Thể hiện 2 cột', '2020-11-09', '2020-11-15', NULL, 1, b'0');
INSERT INTO `task` VALUES (16, 'Chuẩn bị báo cáo BTL', 'Tìm form', '2020-11-16', '2020-11-30', NULL, 1, b'0');

-- ----------------------------
-- Table structure for task_to_employee
-- ----------------------------
DROP TABLE IF EXISTS `task_to_employee`;
CREATE TABLE `task_to_employee`  (
  `task_id` int(0) NOT NULL COMMENT 'FK',
  `employee_id` int(0) NOT NULL COMMENT 'FK',
  `progress` int(0) UNSIGNED NULL DEFAULT 0,
  `deleted` bit(1) NOT NULL DEFAULT b'0',
  `modify_date` date NOT NULL,
  `modify_by` int(0) NOT NULL,
  `paused` bit(1) NOT NULL,
  PRIMARY KEY (`task_id`, `employee_id`) USING BTREE,
  INDEX `fk_employee`(`employee_id`) USING BTREE,
  INDEX `fk_modify`(`modify_by`) USING BTREE,
  CONSTRAINT `fk_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_modify` FOREIGN KEY (`modify_by`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_task` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_to_employee
-- ----------------------------
INSERT INTO `task_to_employee` VALUES (1, 2, 100, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (3, 3, 100, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (4, 5, 100, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 3, 0, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 4, 0, b'0', '2020-11-16', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 6, 0, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 7, 0, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 8, 0, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (5, 11, 0, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (6, 2, 43, b'0', '2020-11-24', 2, b'0');
INSERT INTO `task_to_employee` VALUES (6, 3, 77, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (6, 4, 0, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (6, 5, 0, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (6, 6, 100, b'0', '2020-11-24', 1, b'1');
INSERT INTO `task_to_employee` VALUES (6, 14, 100, b'0', '2020-11-30', 1, b'1');
INSERT INTO `task_to_employee` VALUES (7, 7, 100, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (8, 2, 0, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (10, 10, 29, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (10, 12, 46, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (11, 2, 80, b'0', '2020-11-24', 2, b'0');
INSERT INTO `task_to_employee` VALUES (11, 4, 0, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (12, 2, 20, b'0', '2020-11-30', 1, b'0');
INSERT INTO `task_to_employee` VALUES (12, 4, 100, b'0', '2020-11-13', 1, b'1');
INSERT INTO `task_to_employee` VALUES (12, 6, 0, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (12, 8, 20, b'0', '2020-11-13', 1, b'0');
INSERT INTO `task_to_employee` VALUES (14, 5, 100, b'0', '2020-11-01', 1, b'0');
INSERT INTO `task_to_employee` VALUES (15, 2, 10, b'0', '2020-11-11', 1, b'0');
INSERT INTO `task_to_employee` VALUES (15, 4, 0, b'0', '2020-11-13', 1, b'0');
INSERT INTO `task_to_employee` VALUES (16, 2, 10, b'0', '2020-11-24', 1, b'0');
INSERT INTO `task_to_employee` VALUES (16, 13, 0, b'0', '2020-11-24', 1, b'0');

SET FOREIGN_KEY_CHECKS = 1;
