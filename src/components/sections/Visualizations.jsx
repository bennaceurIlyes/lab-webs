import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import styles from './Visualizations.module.css';

export default function Visualizations() {
  const { t, lang } = useTranslation();
  const [eqStats, setEqStats] = useState([]);
  
  // Simulated hourly data for Béchar Solar & Wind testing platform
  const solarWindData = [
    { hour: '08:00', solar: 120, wind: 45 },
    { hour: '10:00', solar: 450, wind: 50 },
    { hour: '12:00', solar: 780, wind: 40 },
    { hour: '14:00', solar: 820, wind: 55 },
    { hour: '16:00', solar: 590, wind: 65 },
    { hour: '18:00', solar: 210, wind: 70 },
    { hour: '20:00', solar: 0, wind: 85 }
  ];

  useEffect(() => {
    dbService.getEquipment().then((equipment) => {
      // Group by status
      const groups = { available: 0, in_use: 0, maintenance: 0 };
      equipment.forEach(eq => {
        if (groups[eq.status] !== undefined) {
          groups[eq.status]++;
        }
      });

      setEqStats([
        { name: t('statusAvailable'), value: groups.available, color: '#10B981' },
        { name: t('statusInUse'), value: groups.in_use, color: '#C97A34' },
        { name: t('statusMaintenance'), value: groups.maintenance, color: '#EF4444' }
      ]);
    });
  }, [lang]);

  return (
    <section className={styles.vizSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Experimental Monitoring & Lab Analytics
          </h2>
          <p className={styles.subtitle}>
            Live telemetry from the Saoura Solar station and laboratory equipment metrics
          </p>
        </div>

        <div className={`${styles.grid} flex-row-reverse-rtl`}>
          {/* Chart 1: Solar / Wind Telemetry */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Instantaneous Irradiance (W/m²) - Béchar Station
            </h3>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={solarWindData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-light)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-primary-light)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Area 
                    type="monotone" 
                    name="Solar Irradiance" 
                    dataKey="solar" 
                    stroke="var(--color-accent)" 
                    fillOpacity={1} 
                    fill="url(#colorSolar)" 
                  />
                  <Area 
                    type="monotone" 
                    name="Simulated Wind" 
                    dataKey="wind" 
                    stroke="var(--color-primary-light)" 
                    fillOpacity={1} 
                    fill="url(#colorWind)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Equipment Status */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Scientific Equipment Operational Readiness
            </h3>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={eqStats}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eqStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, '']}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
