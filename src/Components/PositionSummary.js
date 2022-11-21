import { Divider, Link, Table } from "@mui/material";
import React, { useState } from "react";
import {Card,CardContent,TableContainer,TableHead,TableCell,TableRow,TableBody} from "@mui/material"
import "./trader.css"
import dayjs from "dayjs";
import { OrderEntry } from "./OrderEntry";

export function PositionSummary({positionSummary, cashBalance,getCFTNumber}) {
   
    const [cftId,setCftId]=useState('');
   
    return (
        <Card sx={{height:"350px",overflowY:"auto"}}>
             <h3>Position Summary</h3>
            <CardContent sx={{pt:0}}>
            <Divider sx={{ my: 0.5 }} textAlign="left" >Cash</Divider>
                <TableContainer >
                    <Table sx={{ mb:5}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Owner Id</TableCell>
                                <TableCell >Bank</TableCell>
                                <TableCell >Account Number</TableCell>
                                <TableCell>Account Type</TableCell>
                                <TableCell>Balance</TableCell>                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cashBalance.map((row,index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >                                       
                                    <TableCell >{row.OwnerID}</TableCell>
                                    <TableCell >{row.Bank}</TableCell>
                                    <TableCell >{row.AccountNumber}</TableCell>
                                    <TableCell >{row.BankAccountType}</TableCell>
                                    <TableCell >{row.Balance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider sx={{ my: 0.5 }} textAlign="left" >Contract</Divider>
                <TableContainer >
                    <Table  size="small" aria-label="a dense table">
                        <TableHead >
                            <TableRow>
                                <TableCell>Owner</TableCell>
                                <TableCell>Side</TableCell>
                                <TableCell>CFT-Number</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Orignal Quantity</TableCell>
                                <TableCell>Remaining Quantity</TableCell>
                                <TableCell>Contract Date</TableCell>
                                <TableCell>Maturity Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {positionSummary.map((row,index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell >{row.OwnerID}</TableCell>
                                    <TableCell>{row.Side}</TableCell>
                                    <TableCell ><Link href="#" underline="none"
                                     onClick={() => getCFTNumber(row.ID)}
                                     >{row.ContractNumber}</Link> </TableCell>
                                    <TableCell >{row.Symbol.replaceAll(',',', ')}</TableCell>
                                    <TableCell >{row.QuantityInLot}</TableCell>
                                    <TableCell >{row.RemainingQuantity}</TableCell>
                                    <TableCell >{dayjs(row.ContractDate).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell >{dayjs(row.MaturityDate).format('DD/MM/YYYY')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            
        </Card>
    );

}