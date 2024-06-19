import React, { useEffect, useState } from 'react';

const Tableau = (props) => {
    const { reportURL, iframeWidth = '100%', iframeHeight = '100vh', onSetShowArcSpinner } = props;
    const [reportName, setReportName] = useState('');
    const [filterArray, setFilterArray] = useState([]);

    useEffect(() => {
        const updateReportNameAndFilters = () => {
            try {
                const reportPath = reportURL.split('/SalesReporting/views/')[1].split('?')[0];
                if (reportPath) {
                    setReportName(reportPath);
                }

                const queryString = reportURL.split('?')[1];
                if (queryString) {
                    const paramsArray = queryString.split('&');
                    setFilterArray(paramsArray);
                }
            } catch (error) {
                console.error("Error parsing report URL:", error);
            }
        };

        const loadTableauScript = () => {
            const existingScript = document.getElementById('tableau-api-script');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://tableau.bsci.com/javascripts/api/viz_v1.js';
                script.id = 'tableau-api-script';
                script.async = true;

                script.onload = () => {
                    const divElement = document.getElementById('viz1716875080181');
                    const vizElement = divElement.getElementsByTagName('object')[0];

                    // Use MutationObserver to detect when the iframe is added and set its dimensions
                    const observer = new MutationObserver(() => {
                        const iframe = divElement.querySelector('iframe');
                        if (iframe) {
                            iframe.style.width = iframeWidth;
                            iframe.style.height = iframeHeight;
                            onSetShowArcSpinner(false); // Hide spinner once the iframe is loaded
                            observer.disconnect();
                        }
                    });

                    observer.observe(divElement, { childList: true, subtree: true });

                    vizElement.style.width = iframeWidth;
                    vizElement.style.height = iframeHeight;
                };

                document.body.appendChild(script);
            } else {
                // If the script is already loaded, call the onload function directly
                existingScript.onload();
            }
        };

        updateReportNameAndFilters();
        loadTableauScript();

        return () => {
            onSetShowArcSpinner(false); // Ensure spinner is hidden on cleanup
        };
    }, [reportURL, iframeWidth, iframeHeight, onSetShowArcSpinner]);

    return (
        <div className='tableauPlaceholder' id='viz1716875080181' style={{ position: 'relative' }}>
            <noscript>
                <a href='#'>
                    <img
                        alt='Top N products by Sales Volume'
                        src='https://public.tableau.com/static/images/To/TopNProducts_17168006299450/TopNproductsbySalesVolume/1_rss.png'
                        style={{ border: 'none' }}
                    />
                </a>
            </noscript>
            <object className='tableauViz' style={{ display: 'none' }}>
                <param name='host_url' value='https://tableau.bsci.com/' />
                <param name='embed_code_version' value='3' />
                <param name='site_root' value='/' />
                <param name='name' value={reportName} />
                <param name='tabs' value='no' />
                <param name='toolbar' value='yes' />
                <param name='animate_transition' value='yes' />
                <param name='display_static_image' value='yes' />
                <param name='display_spinner' value='yes' />
                <param name='display_overlay' value='yes' />
                <param name='display_count' value='yes' />
                <param name='language' value='en-US' />
                {filterArray.map((filter, index) => (
                    <param key={index} name={filter.split('=')[0]} value={filter.split('=')[1]} />
                ))}
            </object>
        </div>
    );
};

export default Tableau;
