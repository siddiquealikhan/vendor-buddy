#!/bin/bash
# Restore the vendorbuddy database from the /docker-seed directory
mongorestore --username admin --password password123 --authenticationDatabase admin --db vendorbuddy /docker-seed

