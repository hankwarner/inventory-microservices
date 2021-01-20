import { microsoft } from './Api';

const logToTeams = (title, text, color, url) => {
    try {
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let body = {
            title: title,
            text: text,
            themeColor: getColorHex(color)
        }

        microsoft().post(url, body, config);

    } catch (e) {
        console.log(`Error in logToTeams ${e}`);
    }
}

const getColorHex = (color) => {
    if (color == 'red') {
        color = 'CD2626';

    } else if (color == 'green') {
        color = '3D8B37';

    } else if (color == 'yellow') {
        color = 'FFFF33';

    } else if (color == 'purple') {
        color = '7F00FF';

    } else {
        color = 'F8F8FF'; // White
    }

    return color;
}

export { logToTeams };
