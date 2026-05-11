import fs from 'fs';

const departments = [
  'Engineering',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Product',
  'Legal'
];

const designations = [
  'Junior',
  'Senior',
  'Lead',
  'Manager',
  'Director'
];

const locations = [
  'Gurgaon, India',
  'Bangalore, India',
  'Pune, India',
  'Hyderabad, India',
  'Mumbai, India'
];

const skills = {
  Engineering: 'React, Node.js, AWS, Cloudflare',
  HR: 'Recruitment, Employee Relations, Payroll',
  Finance: 'Accounting, Taxation, Budget Planning',
  Marketing: 'SEO, Social Media, Branding',
  Sales: 'Lead Generation, CRM, Negotiation',
  Product: 'Roadmaps, Agile, Product Strategy',
  Legal: 'Compliance, Contracts, Corporate Law'
};

const employees = [];

for (let i = 1; i <= 500; i++) {
  const dept = departments[Math.floor(Math.random() * departments.length)];
  const desig = designations[Math.floor(Math.random() * designations.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  employees.push({
    emp_id: `EMP-${1000 + i}`,
    full_name: `Employee Name ${i}`,
    department: dept,
    designation: desig,
    salary: Math.floor(Math.random() * (250000 - 50000) + 50000),
    joining_date: `202${Math.floor(Math.random() * 5)}-${String(
      Math.floor(Math.random() * 12) + 1
    ).padStart(2, '0')}-${String(
      Math.floor(Math.random() * 28) + 1
    ).padStart(2, '0')}`,
    email: `employee${i}@company.com`,
    phone: `+91-98${Math.floor(10000000 + Math.random() * 89999999)}`,
    performance_rating: `${Math.floor(Math.random() * 5) + 1}/5`,
    content: `Employee ${i} works as a ${desig} in the ${dept} department. Expertise in ${skills[dept]}. Currently assigned to Project Alpha.`,
    security_clearance: i % 10 === 0 ? 'Top Secret' : 'General',
    office_location: location
  });
}

fs.writeFileSync(
  './big_company_data.json',
  JSON.stringify(employees, null, 2)
);

console.log('✅ 500 Employees ka JSON data ready hai!');