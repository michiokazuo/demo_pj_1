package com.project1.service;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface BaseService<T> {

	List<T> findAll() throws Exception;

	T findById(Integer id) throws Exception;

	List<T> search_sort(T t, String field, Boolean isASC, Byte status) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	T insert(T t) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	T update(T t) throws Exception;

	@Modifying
	@Transactional(rollbackFor = Exception.class)
	boolean delete(Integer id) throws Exception;

}
