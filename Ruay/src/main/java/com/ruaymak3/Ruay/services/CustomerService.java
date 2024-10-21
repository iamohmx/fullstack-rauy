package com.ruaymak3.Ruay.services;

import com.ruaymak3.Ruay.dto.CustomerDto;
import com.ruaymak3.Ruay.models.Customer;
import com.ruaymak3.Ruay.repositories.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public CustomerDto addCustomer(Customer customer) {
        Customer saveCustomer = customerRepository.save(customer);

        CustomerDto customerDto = new CustomerDto();
        customerDto.setId(saveCustomer.getId());
        customerDto.setName(saveCustomer.getName());
        customerDto.setAddress(saveCustomer.getAddress());
        customerDto.setPhone(saveCustomer.getPhone());
        customerDto.setEmail(saveCustomer.getEmail());

        return customerDto;
    }

    public List<CustomerDto> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();

        return customers.stream()
                .map(customer -> {
                    CustomerDto customerDto = new CustomerDto();
                    customerDto.setId(customer.getId());
                    customerDto.setName(customer.getName());
                    customerDto.setAddress(customer.getAddress());
                    customerDto.setPhone(customer.getPhone());
                    customerDto.setEmail(customer.getEmail());

                    return customerDto;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<Object> getCustomer(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);

        return customerOpt.map(customer -> {
            CustomerDto customerDto = new CustomerDto();
            customerDto.setId(customer.getId());
            customerDto.setName(customer.getName());
            customerDto.setAddress(customer.getAddress());
            customerDto.setPhone(customer.getPhone());
            customerDto.setEmail(customer.getEmail());

            return customerDto;
        });
    }

    public Optional<Object> updateCustomer(Long id, @Valid Customer customer) {
        Optional<Customer> customerOpt = customerRepository.findById(id);

        return customerOpt.map(customer1 -> {
            customer1.setName(customer.getName());
            customer1.setAddress(customer.getAddress());
            customer1.setPhone(customer.getPhone());
            customer1.setEmail(customer.getEmail());

            Customer updatedCustomer = customerRepository.save(customer1);

            CustomerDto customerDto = new CustomerDto();
            customerDto.setId(updatedCustomer.getId());
            customerDto.setName(updatedCustomer.getName());
            customerDto.setAddress(updatedCustomer.getAddress());
            customerDto.setPhone(updatedCustomer.getPhone());
            customerDto.setEmail(updatedCustomer.getEmail());

            return customerDto;
        });
    }

    public Boolean deleteCustomer(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);

        if (customerOpt.isEmpty()) {
            return false;
        }

        customerRepository.deleteById(id);
        return true;
    }
}
