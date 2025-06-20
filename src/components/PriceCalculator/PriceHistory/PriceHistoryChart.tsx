import { useRef, useEffect } from 'react';
import type { PriceHistory } from '../../../types';
import './PriceHistoryChart.css';

interface PriceHistoryChartProps {
  priceHistory: PriceHistory[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ priceHistory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || priceHistory.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find min and max prices
    const prices = priceHistory.map((item) => item.price);
    const minPrice = Math.min(...prices) * 0.9;
    const maxPrice = Math.max(...prices) * 1.1;
    const priceRange = maxPrice - minPrice;

    // Draw axis
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw price labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yStep = chartHeight / 3;
    for (let i = 0; i <= 3; i++) {
      const y = height - padding - i * yStep;
      const price = minPrice + (priceRange * i) / 3;
      ctx.fillText(`$${price.toFixed(2)}`, padding - 5, y);
    }

    // Draw date labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xStep = chartWidth / (priceHistory.length - 1);
    priceHistory.forEach((item, index) => {
      const x = padding + index * xStep;
      const date = new Date(item.date);
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (index === 0 || index === priceHistory.length - 1 || index % 2 === 0) {
        ctx.fillText(dateLabel, x, height - padding + 5);
      }
    });

    // Draw price line
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();

    priceHistory.forEach((item, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((item.price - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw price points
    ctx.fillStyle = '#3498db';
    priceHistory.forEach((item, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((item.price - minPrice) / priceRange) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [priceHistory]);

  return (
    <div className='price-history-chart'>
      <h2>📊 Price History (Last 30 days)</h2>
      <canvas ref={canvasRef} width='600' height='300'></canvas>
    </div>
  );
};
