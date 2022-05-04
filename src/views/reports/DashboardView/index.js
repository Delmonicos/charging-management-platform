import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';
import Budget from './Budget';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const GetPayementConsent = () => {
  return axios({
    method: 'get',
    url: 'https://bf5h52pjn2sju5jji4hz-elasticsearch.services.clever-cloud.com/payment-consent/_search',
    headers: {
      Authorization: 'Basic dWVGanQ0S0hBNHR1bVRsTjRQbjg6OTFoNFMybVBqUTlKS1czWmN2MmE='
    }
  });
};

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

const MapData = (paymentConsents, payments, chargeSessions) => {
  console.log(paymentConsents);
  console.log(payments);
  console.log(chargeSessions);
  return {
    amounts: payments.map((e) => e._source.amount / 1000),
    totalKwh: chargeSessions.reduce((pv, e) => pv + e._source.kwh, 0),
    totalCustomers: [...new Set(chargeSessions.map((e) => e._source.user))].length,
    durations: chargeSessions.map((e) => e._source.duration),
    totalDuration: chargeSessions.reduce((pv, e) => pv + e._source.duration / 1000, 0)
  };
};

const Dashboard = () => {
  const classes = useStyles();

  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      GetPayementConsent(),
      GetPayement(),
      GetChargeSession()
    ]).then((results) => {
      setData(MapData(
        results[0].data.hits.hits,
        results[1].data.hits.hits,
        results[2].data.hits.hits
      ));
    }).catch((e) => {
      console.log('Error: ', e);
    });
  }, []);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {data && <Budget totalDuration={data.totalDuration} />}
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {data && <TotalCustomers allUser={data.totalCustomers} />}
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {data && <TasksProgress allKwh={data.totalKwh} />}
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {data && <TotalProfit totalAmount={data.amounts.reduce((pv, e) => pv + e, 0)} />}
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            {data && <Sales amounts={data.amounts} />}
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            {data && <TrafficByDevice durations={data.durations} />}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
