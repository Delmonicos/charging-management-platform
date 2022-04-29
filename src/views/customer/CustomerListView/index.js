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

const GetPayement = () => {
  return axios({
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/payments/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  });
};

const GetChargeSession = () => {
  return axios({
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/charge-session/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  });
};

const MapData = (payments, chargeSessions) => {
  console.log(payments);
  console.log(chargeSessions);

  return [...new Set(chargeSessions.map((e) => e._source.user))].map((userId) => {
    const userSessions = chargeSessions.filter((e) => e._source.user === userId);
    const userPayments = payments.filter((e) => e._source.user === userId);
    return {
      id: userId,
      nb_sessions: userSessions.length,
      total_kwh: userSessions.reduce((pv, cv) => pv + cv._source.kwh, 0),
      total_amount: userPayments.reduce((pv, cv) => pv + cv._source.amount / 1000, 0),
      total_duration: userSessions.reduce((pv, cv) => pv + (cv._source.duration / 1000), 0)
    };
  });
};

const CustomerListView = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      GetPayement(),
      GetChargeSession()
    ]).then((results) => {
      setData(MapData(
        results[0].data.hits.hits,
        results[1].data.hits.hits
      ));
    }).catch((e) => {
      console.log('Error: ', e);
    });
  }, []);

  return (
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          {data && <Results customers={data} />}
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
