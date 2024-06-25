import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Slider } from "./components/ui/slider";
import { ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const Opto = () => {
  const [assets, setAssets] = useState([
    { name: 'Stock A', return: 0.1, risk: 0.2, weight: 0.25 },
    { name: 'Stock B', return: 0.15, risk: 0.25, weight: 0.25 },
    { name: 'Bond C', return: 0.05, risk: 0.1, weight: 0.25 },
    { name: 'Real Estate D', return: 0.08, risk: 0.15, weight: 0.25 },
  ]);
  const [riskAversion, setRiskAversion] = useState(2);

  const handleInputChange = (index, field, value) => {
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, [field]: parseFloat(value) || 0 } : asset
    ));
  };

  const generateRandomWeights = () => {
    const weights = assets.map(() => Math.random());
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  };

  const calculatePortfolioMetrics = (weights) => {
    const portfolioReturn = weights.reduce((sum, weight, i) => sum + weight * assets[i].return, 0);
    const portfolioRisk = Math.sqrt(weights.reduce((sum, weight, i) => sum + Math.pow(weight * assets[i].risk, 2), 0));
    return { return: portfolioReturn, risk: portfolioRisk };
  };

  const portfolios = useMemo(() => {
    const numPortfolios = 1000;
    return Array(numPortfolios).fill().map(() => {
      const weights = generateRandomWeights();
      const { return: portfolioReturn, risk: portfolioRisk } = calculatePortfolioMetrics(weights);
      const sharpeRatio = (portfolioReturn - 0.02) / portfolioRisk; // Assuming risk-free rate of 2%
      return { return: portfolioReturn, risk: portfolioRisk, sharpeRatio, weights };
    });
  }, [assets]);

  const optimizePortfolio = () => {
    const optimalPortfolio = portfolios.reduce((best, current) => {
      const utility = current.return - (0.5 * riskAversion * Math.pow(current.risk, 2));
      const bestUtility = best.return - (0.5 * riskAversion * Math.pow(best.risk, 2));
      return utility > bestUtility ? current : best;
    });

    setAssets(prev => prev.map((asset, i) => ({
      ...asset,
      weight: optimalPortfolio.weights[i],
    })));
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p>{`Risk: ${(data.risk * 100).toFixed(2)}%`}</p>
          <p>{`Return: ${(data.return * 100).toFixed(2)}%`}</p>
          {data.sharpeRatio && <p>{`Sharpe Ratio: ${data.sharpeRatio.toFixed(2)}`}</p>}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const norwegianFundData = [
    { name: 'Equities', value: 69.8 },
    { name: 'Fixed Income', value: 27.5 },
    { name: 'Unlisted Real Estate', value: 2.5 },
    { name: 'Unlisted Renewable Energy Infrastructure', value: 0.1 },
  ];

  const renderPieChart = (data) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Opto - Portfolio Optimization</h1>
      
      <Tabs defaultValue="optimization">
        <TabsList>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="casestudy">Case Study</TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Optimization Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>Asset</div>
                <div>Return</div>
                <div>Risk</div>
                <div>Weight</div>
                {assets.map((asset, index) => (
                  <React.Fragment key={index}>
                    <Input value={asset.name} onChange={(e) => handleInputChange(index, 'name', e.target.value)} />
                    <Input type="number" value={asset.return} onChange={(e) => handleInputChange(index, 'return', e.target.value)} />
                    <Input type="number" value={asset.risk} onChange={(e) => handleInputChange(index, 'risk', e.target.value)} />
                    <Input type="number" value={asset.weight.toFixed(4)} readOnly />
                  </React.Fragment>
                ))}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Risk Aversion (1-10): {riskAversion.toFixed(1)}</label>
                <Slider
                  value={[riskAversion]}
                  onValueChange={(value) => setRiskAversion(value[0])}
                  max={10}
                  step={0.1}
                />
              </div>
              <Button onClick={optimizePortfolio}>Optimize Portfolio</Button>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Current Portfolio Allocation</h3>
                {renderPieChart(assets.map(asset => ({name: asset.name, value: asset.weight})))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="risk" name="Risk" unit="%" domain={['dataMin', 'dataMax']}>
                    <Label value="Risk (%)" offset={-10} position="insideBottom" />
                  </XAxis>
                  <YAxis type="number" dataKey="return" name="Return" unit="%" domain={['dataMin', 'dataMax']}>
                    <Label value="Return (%)" angle={-90} position="insideLeft" offset={10} />
                  </YAxis>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36}/>
                  <Scatter name="Portfolios" data={portfolios.map(p => ({ 
                    risk: p.risk * 100, 
                    return: p.return * 100,
                    sharpeRatio: p.sharpeRatio
                  }))} fill="#8884d8" />
                  <Scatter name="Current" data={[{
                    risk: calculatePortfolioMetrics(assets.map(a => a.weight)).risk * 100,
                    return: calculatePortfolioMetrics(assets.map(a => a.weight)).return * 100,
                  }]} fill="#82ca9d" shape="star" size={100} />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="casestudy">
          <Card>
            <CardHeader>
              <CardTitle>Case Study: Norwegian Government Pension Fund Global</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Background</h3>
              <p>The Norwegian Government Pension Fund Global, commonly known as the Oil Fund, is one of the world's largest sovereign wealth funds. As of 2023, it manages over $1.4 trillion in assets.</p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Current Asset Allocation</h3>
              {renderPieChart(norwegianFundData)}
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Application of Portfolio Optimization</h3>
              <p>The fund uses advanced portfolio optimization techniques to balance risk and return across a global, multi-asset portfolio. Key considerations include:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Long-term investment horizon</li>
                <li>Diversification across geographies and asset classes</li>
                <li>Ethical investment guidelines</li>
                <li>Adaptation to changing market conditions</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">How This Tool Can Help</h3>
              <p>While simplified, this tool demonstrates core concepts used by funds like NGPFG:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Visualizing the efficient frontier to understand risk-return tradeoffs</li>
                <li>Adjusting risk aversion to align with long-term goals</li>
                <li>Optimizing allocations across different asset classes</li>
              </ul>
              
              <p className="mt-4">
                <strong>Sources:</strong><br />
                1. Norges Bank Investment Management. (2023). Government Pension Fund Global Annual Report 2022.<br />
                2. NBIM. (2023). Investment Strategy 2023 - Government Pension Fund Global.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Opto;
