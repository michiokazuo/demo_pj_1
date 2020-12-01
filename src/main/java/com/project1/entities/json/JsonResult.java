package com.project1.entities.json;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JsonResult<T> {
    private int code;
    private T data;
    private String message;

    public static <T> ResponseEntity<JsonResult<T>> success(T data) {
        return ResponseEntity.ok(new JsonResult<T>(HttpStatus.OK.value(), data, "OK"));
    }

    public static <T> ResponseEntity<JsonResult<T>> uploaded(T data) {
        return ResponseEntity.status(201).body(new JsonResult<T>(HttpStatus.CREATED.value(), data, "uploaded"));
    }

    public static <T> ResponseEntity<JsonResult<String>> updated() {
        return ResponseEntity.status(204).body(new JsonResult<>(HttpStatus.NO_CONTENT.value(), "no data", "updated"));
    }

    public static ResponseEntity<JsonResult<String>> deleted() {
        return ResponseEntity.status(204).body(new JsonResult<>(HttpStatus.NO_CONTENT.value(), "no data", "deleted"));
    }

    //loi ng dung
    public static  ResponseEntity<JsonResult<String>> badRequest(int code, String mess) {
        return ResponseEntity.badRequest().body(new JsonResult<>(code, "no data", mess));
    }

    public static  ResponseEntity<JsonResult<String>> notFound( String mess) {
        return ResponseEntity.status(404).body(new JsonResult<>(404, "no data", mess));
    }

    public static  ResponseEntity<JsonResult<String>> noAuthor() {
        return ResponseEntity.status(401).body(new JsonResult<>(401, "no data", "no authenticated"));
    }

    //loi he thong
    public static ResponseEntity<JsonResult<String>> error(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new JsonResult<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "no data", ex.toString()));
    }


}
