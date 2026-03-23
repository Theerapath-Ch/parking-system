import  { forwardRef } from "react";

interface PrintData {
    plate: string
    entry: string
    exit: string 
    price: number
    discount: string
}
const Receipt = forwardRef<HTMLDivElement, PrintData>((props, ref) => {

    return (

        <div ref={ref} className="w-[280px] p-4 text-center font-mono">

            <h2 className="text-lg font-bold">
                PARKING RECEIPT
            </h2>

            <hr className="my-2" />

            <p>เลขทะเบียน : {props.plate}</p>
            <p>เวลาเข้า  : {props.entry}</p>
            <p>เวลาออก  : {props.exit}</p>
            <p>ส่วนลด  : {props.discount} </p>
            

            <hr className="my-2" />

            <h3 className="text-xl font-bold">
                Total : {props.price} ฿
            </h3>

            <hr className="my-2" />

            <p>Thank you</p>

        </div>

    )

})

export default Receipt