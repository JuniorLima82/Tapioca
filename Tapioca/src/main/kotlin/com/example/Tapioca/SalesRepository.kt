package com.example.Tapioca
import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDate

@Entity
@Table(name = "sales")
data class Sales(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int=0,
    val id_food: Int,
    val cpf: String,
    val sale_date: LocalDate,
    val description: String,
    val price: Double
)

interface SalesRepository: JpaRepository<Sales, Int>{
    @Query("select * from sales where cpf = :cpf", nativeQuery = true)
    fun getAllSalesByCpfClient(@Param("cpf")cpf:String):List<Sales>
}