# Wizard Feature

## Implement a feature for exploring data to build models.

- This feature used https://github.com/NattapongSiri/echarts-react-wrapper to implement echarts react component.
The reason we use echarts-react-wrapper because replaceMerge in 'echarts-for-react' does not support this function.

- This feature used https://github.com/NattapongSiri/echarts-pairplot-v2 to implement pairplot.
The reason we cannot use line chart because line chart of Echarts does not support data selection nor any brush usage.
See https://echarts.apache.org/en/option.html#brush for more details on which type of chart support brush.

- For the future we will use https://github.com/Alpha-Com-Thailand/kde_plot to implement front-end to remove outlier data by chart.


## Data flow

![image](https://user-images.githubusercontent.com/77266865/165040585-817f0adb-64f6-468c-896f-7aadfd33ba03.png)

