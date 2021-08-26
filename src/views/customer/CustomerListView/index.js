import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const GetPayementConsent = (setPayementConsents) => {
  const config = {
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/payment-consent/_search',
    headers: {
      Origin: 'http://test.com',
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
      amount: p._source.amount?.amount,
      duration: _cs._source.duration,
      cs_timestamp: _cs._source.timestamp,
      p_timestamp: p._source.timestamp?.p_timestamp,
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
      bic: pc._source.bic?.bic,
      iban: pc._source.iban?.iban,
      cs_timestamp: _cs.timestamp,
      pc_timestamp: pc._source.timestamp?.pc_timestamp,
      p_timestamp: _cs.timestamp,
    };
  });
  return (tmp);
};

const CustomerListView = () => {
  const classes = useStyles();
  const [payementConsents, setPayementConsents] = useState([]);
  const [payements, setPayements] = useState([]);
  const [chargeSessions, setChargeSessions] = useState([]);

  useEffect(() => {
    GetPayementConsent(setPayementConsents);
    GetPayement(setPayements);
    GetChargeSession(setChargeSessions);
  }, []);

  const data = MapData(payementConsents, payements, chargeSessions);

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <Results customers={data} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
