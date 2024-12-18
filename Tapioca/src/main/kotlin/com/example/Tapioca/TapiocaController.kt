package com.example.Tapioca

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate


data class PaymentRequest(
    val id_food: Int,
    val cpf: String,
    val description: String
)
@CrossOrigin(origins = ["*"])
@RestController
class TapiocasController(val foodsRepository: FoodsRepository,
                         val filingsRepository: FilingsRepository,
                         val salesRepository: SalesRepository) {

    @GetMapping("/food")
    fun getFilingsByFoodId(@RequestParam("id") id: Int = 0): Map<String, Any>{

        try {
            val food = foodsRepository.findById(id);
            val filings = filingsRepository.getAllFilingsByFoodId(id);

            val response =
                mapOf(
                    "price" to food.get().price,
                    "filing" to filings
                );

            return response;
        }catch(e: Exception){
            return mapOf("error" to e.message.toString());
        }
    }
    @GetMapping("/history")
    fun getAllSalesByCpfClient(@RequestParam("cpf")cpf:String):List<Sales>{
        return salesRepository.getAllSalesByCpfClient(cpf)
    }

    @PostMapping("/payment")
    fun processPayment(@RequestBody paymentRequest: PaymentRequest): Map<String, String> {
        return try {

            val food = foodsRepository.findById(paymentRequest.id_food)
            if (food.isEmpty) {
                return mapOf("erro" to "Item de comida não encontrado.")
            }


            val sale = Sales(
                id = 0,
                id_food = paymentRequest.id_food,
                cpf = paymentRequest.cpf,
                sale_date = LocalDate.now(),
                description = paymentRequest.description,
                price = food.get().price.toDouble()
            )


            salesRepository.save(sale)

            mapOf("mensagem" to "Pagamento processado com sucesso.")
        } catch (e: Exception) {
            mapOf("erro" to "Ocorreu um erro ao processar o pagamento: ${e.message}")
        }
    }

}




