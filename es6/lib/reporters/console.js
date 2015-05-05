import chalk from 'chalk';

function consoleReporter(component, message, { style }) {
  let componentName = component.fullyQualifiedName;
  let stylishStatus = chalk[style](message);
  console.log(`${stylishStatus}: ${componentName}`);
}

export default consoleReporter;
