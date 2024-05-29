import React, { useEffect, useState } from 'react';

const Tableau = (props) => {
    const { reportURL } = props;
    const [reportName, setReportName] = useState(false);
    useEffect(() => {
        const regex = /viz\/([^?]+)/;
        const match = reportURL.match(regex);
        // console.log(match[0]);
        // const reportName = match[1];
        setReportName(match[1])
        const script = document.createElement('script');
        script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        script.async = true;
        script.onload = () => {
            const divElement = document.getElementById('viz1716875080181');
            const vizElement = divElement.getElementsByTagName('object')[0];
            vizElement.style.width = '100%';
            vizElement.style.height = '100vh';
            // vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className='tableauPlaceholder' id='viz1716875080181' style={{ position: 'relative' }}>
            <noscript>
                {/* <a href='#'>
                    <img
                        alt='Top N products by Sales Volumee'
                        src='https://public.tableau.com/static/images/To/TopNProducts_17168006299450/TopNproductsbySalesVolume/1_rss.png'
                        style={{ border: 'none' }}
                    />
                </a> */}
            </noscript>
            <object className='tableauViz' style={{ display: 'none' }}>
                <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
                <param name='embed_code_version' value='3' />
                <param name='site_root' value='' />
                <param name='name' value={reportName} />
                <param name='tabs' value='no' />
                <param name='toolbar' value='yes' />
                {/* <param name='static_image'lic value='https://pub.tableau.com/static/images/To/TopNProducts_17168006299450/TopNproductsbySalesVolume/1.png' /> */}
                <param name='animate_transition' value='yes' />
                <param name='display_static_image' value='yes' />
                <param name='display_spinner' value='yes' />
                <param name='display_overlay' value='yes' />
                <param name='display_count' value='yes' />
                <param name='language' value='en-US' />
                <param name='filter' value='publish=yes' />
            </object>
        </div>
    );
};



export default Tableau;
