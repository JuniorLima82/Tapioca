package com.example.Tapioca

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@Entity
@Table(name = "filing")
data class Filings (
    @Id val id_food: Int,
    val name: String,
    val price: Float
)

interface FilingsRepository: JpaRepository<Filings, Int> {

    @Query("select name, price from filing where id_food = :id", nativeQuery = true)
    fun getAllFilingsByFoodId(@Param("id") id: Int): List<Map<String, Float>>
}