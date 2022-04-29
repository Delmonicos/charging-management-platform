import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, ArcElement, LineElement
} from 'chart.js';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';
import axios from 'axios';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

ChartJS.register(CategoryScale, LinearScale, PointElement, ArcElement, LineElement);

const useStyles = makeStyles(() => ({
  root: {}
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

const Sales = ({ className, ...rest }) => {
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

  console.log(tmp);
  const kwh = tmp.map((item) => {
    return (item.kwh);
  });
  const duration = tmp.map((item) => {
    return (item.duration / 60);
  });
  const amount = tmp.map((item) => {
    return (item.amount);
  });
  console.log(amount);
  console.log(kwh);
  console.log(duration);

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: [18, 5, 19, 27, 29, 19, 20],
        label: 'kwh',
        barThickness: 12,
        maxBarThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.5
      },
      {
        backgroundColor: colors.grey[200],
        data: [11, 20, 12, 29, 30, 25, 13],
        label: 'duration',
        barThickness: 12,
        maxBarThickness: 10,
        barPercentage: 0.5,
        categoryPercentage: 0.5
      }
    ],
    labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug']
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        grid: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    },
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

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={(
          <Button
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
          >
            Last 7 days
          </Button>
        )}
        title="Charge sessions"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          <Chart
            type="line"
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};

Sales.propTypes = {
  className: PropTypes.string
};

export default Sales;
