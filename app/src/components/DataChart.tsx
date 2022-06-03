import {
    Chart as ChartJS,
    CategoryScale,
    ChartData,
    ChartOptions,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineProps {
    options: ChartOptions<'line'>;
    data: ChartData<'line'>;
}

const dummyOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Stock Values Line Chart',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const stocks1 = [200, 300, 350, 500, 900, -10, 500];
const stocks2 = [200, 400, 300, 580, 700, 1000, 400];

const dummyData = {
    labels,
    datasets: [
        {
            label: 'User 1',
            data: stocks1,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'User 2',
            data: stocks2,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

function DataChart({ options = dummyOptions, data = dummyData }) {
    return <Line options={options} data={data} />;
}

export default DataChart;