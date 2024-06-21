import React, { useEffect, useRef } from 'react';
 
const Tableau = (props) => {
  const ref = useRef(null);
  const {reportURL} = props;
 
  useEffect(() => {
    if (!window.customElements.get('tableau-viz')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://tableau.bsci.com/javascripts/api/tableau.embedding.3.2022.1.min.js'; // Use the appropriate version
      script.onload = () => {
        // Tableau embedding script is loaded and ready to use
      };
      document.body.appendChild(script);
 
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
 
  return (
    <div>
      <tableau-viz
        ref={ref}
        id='tableau-viz'
        src={reportURL}//'https://tableau.bsci.com/#/site/SalesReporting/views/PFO-Whatif/PortfolioOptimization?Division%20(Pfo%20Normalized)=Endo'//'https://tableau.bsci.com/t/SalesReporting/views/PFOLexDashboards/GrowthAndMargin/56753aa3-871d-4009-a145-e3c01df461c7/f7208358-4ea0-4d4f-af7d-64aa0cd42769'
        width='1200px'
        height='545px'
        hide-tabs
      ></tableau-viz>
    </div>
  );
}
 
export default Tableau;