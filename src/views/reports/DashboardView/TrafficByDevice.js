import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import axios from 'axios';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import TabletIcon from '@material-ui/icons/Tablet';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const GetPayementConsent = (setPayementConsents) => {
  const config = {
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/payment-consent/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  };

  axios(config)
    .then((response) => {
      setPayementConsents(response.data.hits.hits);
      console.log('Payement consent data is correctly recover');
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetPayement = (setPayement) => {
  const config = {
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/payments/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  };

  axios(config)
    .then((response) => {
      setPayement(response.data.hits.hits);
      console.log('Payement data is correctly recover');
    })
    .catch((error) => {
      console.log(error);
    });
};

const GetChargeSession = (setChargeSessions) => {
  const config = {
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/charge-session/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  };

  axios(config)
    .then((response) => {
      setChargeSessions(response.data.hits.hits);
      console.log('Charge session data is correctly recover');
    })
    .catch((error) => {
      console.log(error);
    });
};

const MapData = (payementConsents, payements, chargeSessions) => {
  const cs = chargeSessions.map((_cs) => {
    const p = payements.find((_p) => _p._source.session_id === _cs._source.session_id);
    if (!p) {
      return (0);
    }
    return {
      user: _cs._source.user,
      charger: _cs._source.charger,
      session_id: _cs._source.session_id,
      kwh: _cs._source.kwh,
      amount: p._source.amount?.amount || 0,
      duration: _cs._source.duration,
      cs_timestamp: _cs._source.timestamp,
      p_timestamp: p._source.timestamp?.p_timestamp || 0,
    };
  });
  const tmp = cs.map((_cs) => {
    const pc = payementConsents.find((_pc) => _pc._source.user === _cs.user);
    if (!pc) {
      return (0);
    }
    return {
      user: _cs.user,
      charger: _cs.charger,
      session_id: _cs.session_id,
      kwh: _cs.kwh,
      amount: _cs.amount,
      duration: _cs.duration,
      bic: pc._source.bic?.bic || 0,
      iban: pc._source.iban?.iban || 0,
      cs_timestamp: _cs.timestamp,
      pc_timestamp: pc._source.timestamp?.pc_timestamp || 0,
      p_timestamp: _cs.timestamp,
    };
  });
  return (tmp);
};

const TrafficByDevice = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [payementConsents, setPayementConsents] = useState([]);
  const [payements, setPayements] = useState([]);
  const [chargeSessions, setChargeSessions] = useState([]);

  useEffect(() => {
    GetPayementConsent(setPayementConsents);
    GetPayement(setPayements);
    GetChargeSession(setChargeSessions);
  }, []);

  const tmp = MapData(payementConsents, payements, chargeSessions);

  const duration = tmp.map((item) => {
    return (item.duration);
  });
  const allDuration = duration.reduce((_ad, _d) => _ad + _d, 0);
  const libre = 86400 - (allDuration / duration.length);
  const occupe = allDuration / duration.length;
  const pLibre = (libre * 100) / 86400;
  const pOccupe = (occupe * 100) / 86400;

  const data = {
    datasets: [
      {
        data: [libre, occupe],
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Libre', 'Occupé']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'PDC Libre',
      value: pLibre.toFixed(0),
      icon: LaptopMacIcon,
      color: colors.indigo[500]
    },
    {
      title: 'PDC Occupé',
      value: pOccupe.toFixed(0),
      icon: TabletIcon,
      color: colors.red[600]
    },
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Occupation des points de charge" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              p={1}
              textAlign="center"
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

export default TrafficByDevice;
