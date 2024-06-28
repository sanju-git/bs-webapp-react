import React, { useEffect } from 'react';

const TableauEmbed = ({ reportURL }) => {
    useEffect(() => {
        const vizUrl = reportURL;
        const options = {
            hideTabs: true,
            width: '100%',
            height: '90vh',
        };

        const vizContainer = document.getElementById('tableauViz');
        let viz = new window.tableau.Viz(vizContainer, vizUrl, options);

        return () => viz.dispose();
    }, [reportURL]);

    return <div id="tableauViz"></div>;
};

export default TableauEmbed;
