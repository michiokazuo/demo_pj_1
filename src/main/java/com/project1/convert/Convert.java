package com.project1.convert;

import java.util.List;

public interface Convert<Main, Link, DTO> {
    List<DTO> toDTO(List<Main> m1, List<Link> m2) throws Exception;
}
