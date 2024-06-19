import React, { useEffect, useState } from 'react';

const Tableau = (props) => {
    const { reportURL, iframeWidth = '100%', iframeHeight = '100vh',onSetShowArcSpinner } = props;
    const [reportName, setReportName] = useState('');
    const [filterArray, setFilterArray] = useState([]);

    useEffect(() => {

        let reportregex = reportURL.split('/SalesReporting/views/')[1].split('/')[0];
        // const regex = /viz\/([^?]+)/;
        // const match = reportURL.match(regex);
        if (reportregex && reportregex.length>=1) {
            setReportName(reportregex);
        }
        // setReportName(reportURL);

        // Extract and split the query string
        const queryString = reportURL.split('?')[1];
        if (queryString) {
            const paramsArray = queryString.split('&');
            if (paramsArray.length >= 1) {
                setFilterArray(paramsArray);
            }
        }

        const script = document.createElement('script');
        script.src = 'https://tableau.bsci.com/javascripts/api/viz_v1.js';
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
                    observer.disconnect();
                }
            });

            observer.observe(divElement, { childList: true, subtree: true });

            vizElement.style.width = iframeWidth;
            vizElement.style.height = iframeHeight;
        };
        onSetShowArcSpinner(false);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [reportURL, iframeWidth, iframeHeight]);

    return (
        <div className='tableauPlaceholder' id='viz1716875080181' style={{ position: 'relative' }}>
            <noscript>
                {/* <a href='#'>
                    <img
                        alt='Top N products by Sales Volume'
                        src='https://public.tableau.com/static/images/To/TopNProducts_17168006299450/TopNproductsbySalesVolume/1_rss.png'
                        style={{ border: 'none' }}
                    />
                </a> */}
            </noscript>
            <object className='tableauViz' style={{ display: 'none' }}>
                <param name='host_url' value='https%3A%2F%2Ftableau.bsci.com%2F' />
                <param name='embed_code_version' value='3' />
                <param name='site_root' value='' />
                <param name='name' value={reportName} />
                <param name='tabs' value='no' />
                <param name='toolbar' value='yes' />
                {/* <param name='static_image' value='https://pub.tableau.com/static/images/To/TopNProducts_17168006299450/TopNproductsbySalesVolume/1.png' /> */}
                <param name='animate_transition' value='yes' />
                <param name='display_static_image' value='yes' />
                <param name='display_spinner' value='yes' />
                <param name='display_overlay' value='yes' />
                <param name='display_count' value='yes' />
                <param name='language' value='en-US' />
                {filterArray.map((filter, index) => (
                    <param key={index} name='filter' value={filter} />
                ))}
            </object>
        </div>
    );
};

export default Tableau;
