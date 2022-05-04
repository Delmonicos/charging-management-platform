import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
} from 'chart.js';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  colors
} from '@material-ui/core';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

const useStyles = makeStyles(() => ({
  root: {}
}));

const Sales = ({ amounts, className, ...rest }) => {
  const classes = useStyles();

  console.log(amounts);
  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: amounts,
        label: '€',
      }
    ],
    labels: amounts.map((e) => { return `${e} €`; })
  };

  const options = {
    responsive: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };

  // const options = {
  //   animation: false,
  //   cornerRadius: 20,
  //   layout: { padding: 0 },
  //   legend: { display: false },
  //   maintainAspectRatio: false,
  //   responsive: true,
  //   scales: {
  //     x: {
  //       ticks: {
  //         fontColor: theme.palette.text.secondary
  //       },
  //       grid: {
  //         display: false,
  //         drawBorder: false
  //       }
  //     },
  //     y: {
  //       ticks: {
  //         fontColor: theme.palette.text.secondary,
  //         beginAtZero: true,
  //         min: 0
  //       },
  //       grid: {
  //         borderDash: [2],
  //         borderDashOffset: [2],
  //         color: theme.palette.divider,
  //         drawBorder: false,
  //         zeroLineBorderDash: [2],
  //         zeroLineBorderDashOffset: [2],
  //         zeroLineColor: theme.palette.divider
  //       }
  //     }
  //   },
  //   tooltips: {
  //     backgroundColor: theme.palette.background.default,
  //     bodyFontColor: theme.palette.text.secondary,
  //     borderColor: theme.palette.divider,
  //     borderWidth: 1,
  //     enabled: true,
  //     footerFontColor: theme.palette.text.secondary,
  //     intersect: false,
  //     mode: 'index',
  //     titleFontColor: theme.palette.text.primary
  //   }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title="Charge sessions"
      />
      <Divider />
      <CardContent>
        <Box
          height={420}
          position="relative"
        >
          <Chart
            type="bar"
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

Sales.propTypes = {
  amounts: PropTypes.array,
  className: PropTypes.string
};

export default Sales;
