import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

const TableauEmbed = ({ reportURL, showChat, isChatCollapsed }) => {
    useEffect(() => {
        const vizUrl = reportURL;
        const options = {
            hideTabs: true,
            width: '100%',
            height: '91.8vh',
        };

        const vizContainer = document.getElementById('tableauViz');
        let viz = new window.tableau.Viz(vizContainer, vizUrl, options);

        return () => viz.dispose();
    }, [reportURL]);

    return (<>
        {isChatCollapsed && (<div className="toggleRight">
            <FontAwesomeIcon
                style={{ color: "#a2a2a2", height: 24, width: 24 }}
                icon={faCircleChevronRight}
                onClick={() => showChat()}
            />
        </div>)}
        <div id="tableauViz"></div></>);
};

export default TableauEmbed;
