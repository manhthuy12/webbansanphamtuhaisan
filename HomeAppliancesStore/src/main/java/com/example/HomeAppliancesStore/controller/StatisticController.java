package com.example.HomeAppliancesStore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.HomeAppliancesStore.dto.StatisticDTO;
import com.example.HomeAppliancesStore.service.StatisticService;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistics")
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    // API để thống kê doanh thu và các thông số khác trong khoảng thời gian
    // startDate - endDate
    @GetMapping
    public ResponseEntity<StatisticDTO> getStatistics(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        StatisticDTO statistics = statisticService.getStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }
}
