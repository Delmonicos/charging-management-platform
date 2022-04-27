import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import axios from 'axios';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
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

const TasksProgress = ({ className, ...rest }) => {
  const classes = useStyles();

  const [payementConsents, setPayementConsents] = useState([]);
  const [payements, setPayements] = useState([]);
  const [chargeSessions, setChargeSessions] = useState([]);

  useEffect(() => {
    GetPayementConsent(setPayementConsents);
    GetPayement(setPayements);
    GetChargeSession(setChargeSessions);
  }, []);

  const tmp = MapData(payementConsents, payements, chargeSessions);

  const kwh = tmp.map((item) => {
    return (item.kwh);
  });
  const allKwh = kwh.reduce((_ak, _k) => _ak + (_k || 0), 0);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              KWh TOTALE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {allKwh}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;
