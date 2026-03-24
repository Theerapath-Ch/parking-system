import { useEffect, useState } from "react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import Receipt from "./component/Receipt"

interface Car {
  plate: string
  entry: Date
}
interface PrintData {
  plate: string
  entry: string
  exit: string 
  price: number
  discount: string
}

export default function App() {

  const [plate, setPlate] = useState("")
  const [cars, setCars] = useState<Car[]>([])
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [printData, setPrintData] = useState<PrintData | null >({
                                              plate: "",
                                              entry: "",
                                              exit: "" ,
                                              price: 0,
                                              discount:""
                                            })
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState("0")
  // let discount = 0 

  const addCar = () => {

    if (!plate) return

    const newCar: Car = {
      plate,
      entry: new Date()
    }

    setCars([...cars, newCar])
    setPlate("")
  }

  const calculatePrice = (entry: Date, discount?: string) => {

  const diffMs = Date.now() - entry.getTime()
  const minutes = Math.ceil(diffMs / (1000 * 60)) // ปัดขึ้นเป็นนาที
  // Landmark Case
    if (discount === "landmark") {

      const freeMinutes = 180 // 3 ชั่วโมง

      if (minutes <= freeMinutes) return 0

      const remainingMinutes = minutes - freeMinutes
      const hours = Math.ceil(remainingMinutes / 60)

      return hours * 10
    }
      //  Normal Case
      
      // 0-20 นาที ฟรี
      if (minutes <= 20) return 0
    
      // 21-60 นาที = 40 บาท
      if (minutes <= 60) return 40
    
      // เกิน 60 นาที
      const hours = Math.ceil(minutes / 60)
    
      return hours * 40
    }

  
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef:  receiptRef 
  })
  
  const handlePrepareAndPrint =  () => {
    if (!selectedCar) return
    
    const result = calculatePrice(selectedCar.entry , discount)
    // console.log(result);
    setPrice(result)
    


    const now = new Date()
    
    setPrintData({
      plate: selectedCar.plate,
      entry: selectedCar.entry.toLocaleTimeString(),
      exit: now.toLocaleTimeString(),
      price: price,
      discount:discount
    })
    }
    useEffect(() => {
      if (printData!.plate) {
        handlePrint()

        setPrintData({
          plate: "",
          entry: "",
          exit: "",
          price:0,
          discount:""
        })
      }
    }, [printData])

  return (

    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <div className="bg-white shadow p-4 flex justify-between">

        <h1 className="text-xl font-bold">
          🚗 Parking POS
        </h1>

        {/* <div className="font-semibold text-indigo-600">
          Today Revenue : 0 ฿
        </div> */}

      </div>

      {/* CONTENT */}

      <div className="p-6">

        {/* ENTRY */}

        <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">

          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="ทะเบียนรถ"
            className="border p-2 rounded flex-1"
          />

          <button
            onClick={addCar}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            รถเข้า
          </button>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded shadow">

          <table className="w-full">

            <thead className="bg-slate-200">

              <tr>

                <th className="p-3">Plate</th>
                <th>Entry</th>
                <th>Duration</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {cars.map((car, index) => {

                const diff = Date.now() - car.entry.getTime()
                // console.log(diff);
                

                const hours = Math.floor(diff / (1000 * 60 * 60))
                // console.log(hours);
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                // console.log(minutes);

                return (

                  <tr key={index} className="border-t">

                    <td className="p-3">{car.plate}</td>

                    <td>
                      {car.entry.toLocaleTimeString()}
                    </td>

                    <td>
                      {hours}h {minutes}m
                    </td>

                    <td>

                      <button
                        onClick={() => setSelectedCar(car)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        รถออก
                      </button>

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAYMENT MODAL */}

      {selectedCar && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
{/* pop up exit */}
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              🚗 {selectedCar.plate}
            </h2>
            <p>
              Entry : {selectedCar.entry.toLocaleTimeString()}
            </p>
            <p className="mt-2 font-semibold">
              exit : {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-2 font-semibold">
              Price : {price} ฿
            </p>
            <p className="mt-2 font-semibold">
                discount :
                <select
                  className="border-2 ml-2"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="landmark">Landmark</option>
                </select>
            </p>
{/* pop up exit */}
            <div className="flex gap-2 mt-6">

              <button
                className="flex-1 bg-slate-400 text-white p-2 rounded"
                onClick={() => setSelectedCar(null)}
              >
                Cancel
              </button>

              <button
                onClick={handlePrepareAndPrint}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Print Receipt
              </button>
              <div style={{ display: "none" }}>
                <Receipt
                  ref={receiptRef}
                  plate={printData!.plate}
                  entry={printData!.entry}
                  exit={printData!.exit}
                  price={printData!.price}
                  discount={printData!.discount}
                />

              </div>


              {/* <button
                className="flex-1 bg-indigo-600 text-white p-2 rounded"
                onClick={() => removeCar(selectedCar)}
              >
                Pay & Exit
              </button> */}


            </div>

          </div>

        </div>

      )}

    </div>

  )

}