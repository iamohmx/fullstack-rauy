import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

// สร้างฟังก์ชันเพื่อแปลงวันที่จาก 'YYYY-MM-DD' เป็น 'วัน เดือน'
const formatDateToDayMonth = (dateString) => {
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const [year, month, day] = dateString.split('-'); // แยกปี เดือน วัน
    const buddhistYear = parseInt(year, 10) + 543; // เพิ่ม 543 เพื่อแปลงเป็น พ.ศ.
    const monthName = monthNames[parseInt(month, 10) - 1]; // หาชื่อเดือนจาก array
    
    return `${parseInt(day, 10)} ${monthName} ${buddhistYear}`; // คืนค่าเป็นรูปแบบ 'วัน เดือน'
};

const Graph = ({ salesData, dates, label }) => {
    const chartRef = useRef(null); // สร้าง ref เพื่ออ้างอิงถึงกราฟ
    const transformedDates = dates.map(date => formatDateToDayMonth(date));

    const data = {
        labels: transformedDates, // ใช้วันที่ที่แปลงเป็น 'วัน เดือน'
        datasets: [
            {
                label: label,
                data: salesData, // y-axis data (sales)
                fill: true,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    useEffect(() => {
        return () => {
            // ทำลายกราฟเมื่อ component ถูก unmount
            if (chartRef.current) {
                chartRef.current.destroy(); // ทำลายกราฟเก่าเพื่อไม่ให้เกิดข้อผิดพลาด
            }
        };
    }, []);

    return (
        <div>
            <Line
                data={data}
                ref={chartRef} // อ้างอิงกราฟผ่าน ref
                key={JSON.stringify(data)} // เพิ่ม key เพื่อบังคับให้กราฟใหม่
            />
        </div>
    );
};

export default Graph;
